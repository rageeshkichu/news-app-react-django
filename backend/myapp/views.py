from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .models import News, Advertisement
from .serializers import NewsSerializer, AdvertisementSerializer, UserSerializer, UserDetailSerializer
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.views.decorators.http import require_http_methods
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.db import DatabaseError
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
logger = logging.getLogger(__name__)
@csrf_exempt
def loginUser(request):
    if request.method != 'POST':
        logger.warning(f'Invalid request method for login: {request.method}')
        return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        if not username or not password:
            logger.warning('Login attempt with missing credentials')
            return JsonResponse({
                'success': False, 
                'message': 'Username and password are required'
            }, status=400)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            logger.info(f'User {username} logged in successfully')
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'access_token': access_token,
                'refresh_token': refresh_token,
                'is_superuser': user.is_superuser,
                'user_id': user.id,
                'username': user.username
            }, status=200)
        else:
            logger.warning(f'Failed login attempt for username: {username}')
            return JsonResponse({
                'success': False, 
                'message': 'Invalid username or password'
            }, status=401)
    except json.JSONDecodeError:
        logger.error('Invalid JSON in login request')
        return JsonResponse({
            'success': False, 
            'message': 'Invalid JSON format'
        }, status=400)
    except Exception as e:
        logger.error(f'Login error: {str(e)}')
        return JsonResponse({
            'success': False, 
            'message': 'An error occurred during login'
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_news(request):
    try:
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        content = request.POST.get('content', '').strip()
        category = request.POST.get('category', 'general').strip()
        author_name = request.POST.get('authorName', '').strip()
        time = request.POST.get('time', '').strip()
        place = request.POST.get('place', '').strip()
        image = request.FILES.get('image')
        author_image = request.FILES.get('authorImage')
        
        required_fields = {'title': title, 'description': description, 'content': content, 
                          'author_name': author_name, 'time': time, 'place': place}
        missing_fields = [field for field, value in required_fields.items() if not value]
        if missing_fields:
            logger.warning(f'Missing required fields: {missing_fields}')
            return Response({
                'success': False, 
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(title) > 500:
            return Response({'success': False, 'message': 'Title too long (max 500 characters)'}, status=status.HTTP_400_BAD_REQUEST)
        if len(description) > 500:
            return Response({'success': False, 'message': 'Description too long (max 500 characters)'}, status=status.HTTP_400_BAD_REQUEST)
        
        news = News.objects.create(
            title=title,
            description=description,
            content=content,
            category=category,
            image=image,
            author_name=author_name,
            author_image=author_image,
            time=time,
            place=place
        )
        
        serializer = NewsSerializer(news, context={'request': request})
        logger.info(f'News created successfully: {news.id} - {title}')
        return Response({
            'success': True, 
            'message': 'News added successfully!', 
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    except DatabaseError as e:
        logger.error(f'Database error while adding news: {str(e)}')
        return Response({'success': False, 'message': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error adding news: {str(e)}')
        return Response({'success': False, 'message': 'An error occurred while adding news'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_adv(request):
    try:
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        content = request.POST.get('content', '').strip()
        image = request.FILES.get('image')
        
        if not all([title, description, content]):
            logger.warning('Missing required fields for advertisement')
            return Response({'success': False, 'message': 'Title, description, and content are required!'}, status=status.HTTP_400_BAD_REQUEST)
        
        ad = Advertisement.objects.create(
            title=title,
            description=description,
            content=content,
            image=image,
        )
        
        serializer = AdvertisementSerializer(ad, context={'request': request})
        logger.info(f'Advertisement created successfully: {ad.id} - {title}')
        return Response({
            'success': True, 
            'message': 'Advertisement added successfully!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    except DatabaseError as e:
        logger.error(f'Database error while adding advertisement: {str(e)}')
        return Response({'success': False, 'message': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error adding advertisement: {str(e)}')
        return Response({'success': False, 'message': 'An error occurred while adding advertisement'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def fetch_all_news(request):
    try:
        news_items = News.objects.all()
        serializer = NewsSerializer(news_items, many=True, context={'request': request})
        logger.info(f'Fetched {len(news_items)} news items')
        return Response({'news': serializer.data}, status=status.HTTP_200_OK)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news: {str(e)}')
        return Response({'error': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error fetching news: {str(e)}')
        return Response({'error': 'An error occurred while fetching news'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'DELETE'])
def get_delete_news(request, id):
    if request.method == 'DELETE' and not request.user.is_authenticated:
        return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        news = News.objects.get(id=id)
    except News.DoesNotExist:
        logger.warning(f'News item not found: {id}')
        return Response({'error': 'News item not found'}, status=status.HTTP_404_NOT_FOUND)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news: {str(e)}')
        return Response({'error': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    try:
        if request.method == 'GET':
            serializer = NewsSerializer(news, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        elif request.method == 'DELETE':
            news_id = news.id
            news.delete()
            logger.info(f'News deleted successfully: {news_id}')
            return Response({'success': 'News deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            logger.warning(f'Invalid request method for get_delete_news: {request.method}')
            return Response({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as e:
        logger.error(f'Error in get_delete_news: {str(e)}')
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
from django.utils import timezone

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def news_update(request, id):
    try:
        news = News.objects.get(id=id)
    except News.DoesNotExist:
        logger.warning(f'News item not found for update: {id}')
        return Response({'success': False, 'message': 'News not found!'}, status=status.HTTP_404_NOT_FOUND)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news: {str(e)}')
        return Response({'success': False, 'message': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    try:
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        content = request.POST.get('content', '').strip()
        category = request.POST.get('category', '').strip()
        time = request.POST.get('time', '').strip()
        place = request.POST.get('place', '').strip()
        author_name = request.POST.get('authorName', '').strip()
        
        if title:
            news.title = title
        if description:
            news.description = description
        if content:
            news.content = content
        if category:
            news.category = category
        if time:
            news.time = time
        if place:
            news.place = place
        if author_name:
            news.author_name = author_name
        if 'image' in request.FILES:
            news.image = request.FILES['image']
        if 'authorImage' in request.FILES:
            news.author_image = request.FILES['authorImage']
        
        news.publication_date = timezone.now()
        news.save()
        
        serializer = NewsSerializer(news, context={'request': request})
        logger.info(f'News updated successfully: {id}')
        return Response({
            'success': True, 
            'message': 'News updated successfully!',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    except DatabaseError as e:
        logger.error(f'Database error while updating news: {str(e)}')
        return Response({'success': False, 'message': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error updating news: {str(e)}')
        return Response({'success': False, 'message': 'An error occurred while updating news'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def list_ads(request):
    try:
        ads_items = Advertisement.objects.all()
        serializer = AdvertisementSerializer(ads_items, many=True, context={'request': request})
        return Response({'ads': serializer.data}, status=status.HTTP_200_OK)
    except DatabaseError as e:
        logger.error(f'Database error while fetching ads: {str(e)}')
        return Response({'error': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error fetching ads: {str(e)}')
        return Response({'error': 'An error occurred while fetching ads'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def edit_ad(request, ad_id):
    try:
        ad = Advertisement.objects.get(id=ad_id)
    except Advertisement.DoesNotExist:
        return Response({'error': 'Advertisement not found'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = AdvertisementSerializer(ad, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'DELETE':
        ad.delete()
        return Response({'success': 'Advertisement deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def fetch_ad(request, id):
    try:
        ad = Advertisement.objects.get(id=id)
        serializer = AdvertisementSerializer(ad, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Advertisement.DoesNotExist:
        return Response({'error': 'Advertisement not found'}, status=status.HTTP_404_NOT_FOUND)
    except DatabaseError as e:
        logger.error(f'Database error while fetching ad: {str(e)}')
        return Response({'error': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error fetching ad: {str(e)}')
        return Response({'error': 'An error occurred while fetching ad'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_ad(request, id):
    try:
        ad = Advertisement.objects.get(id=id)
    except Advertisement.DoesNotExist:
        return Response({'success': False, 'message': 'Ad not found!'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        ad.title = request.POST.get('title', ad.title)
        ad.description = request.POST.get('description', ad.description)
        ad.content = request.POST.get('content', ad.content)
        if 'image' in request.FILES:
            ad.image = request.FILES['image']
        ad.save()
        
        serializer = AdvertisementSerializer(ad, context={'request': request})
        return Response({
            'success': True, 
            'message': 'Ad updated successfully!',
            'data': serializer.data
        }, status=status.HTTP_200_OK)
    except DatabaseError as e:
        logger.error(f'Database error while updating ad: {str(e)}')
        return Response({'success': False, 'message': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error updating ad: {str(e)}')
        return Response({'success': False, 'message': 'An error occurred while updating ad'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def news_count(request):
    count = News.objects.count()
    return JsonResponse({'count': count})

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def ads_count(request):
    count = Advertisement.objects.count()
    return JsonResponse({'count': count})

@api_view(['GET'])
def get_news(request):
    try:
        news_queryset = News.objects.all()
        news_data = []
        for news in news_queryset:
            news_data.append({
                'title': news.title,
                'description': news.description,
                'content': news.content,
                'category': news.category,
                'image_url': news.image_url,
                'link': news.link,
                'source_id': news.source_id,
                'pubDate': news.pubDate.strftime('%Y-%m-%d %H:%M:%S'),
            })
        return JsonResponse({'results': news_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def get_ads(request):
    try:
        ads_queryset = Advertisement.objects.all()
        ads_data = []
        for ad in ads_queryset:
            ads_data.append({
                'title': ad.title,
                'description': ad.description,
                'image_url': ad.image_url,
                'link': ad.link,
            })
        return JsonResponse({'results': ads_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
def news_detail(request, id):
    try:
        news_item = get_object_or_404(News, id=id)
        serializer = NewsSerializer(news_item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f'Error fetching news detail: {str(e)}')
        return Response({'error': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def ad_list(request):
    try:
        ads = Advertisement.objects.all()
        serializer = AdvertisementSerializer(ads, many=True, context={'request': request})
        return Response({'ads': serializer.data}, status=status.HTTP_200_OK)
    except DatabaseError as e:
        logger.error(f'Database error while fetching ads: {str(e)}')
        return Response({'error': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error fetching ads: {str(e)}')
        return Response({'error': 'An error occurred while fetching ads'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@csrf_exempt
def register_user(request):
    if request.method != 'POST':
        logger.warning(f'Invalid request method for register_user: {request.method}')
        return JsonResponse({'success': False, 'message': 'Invalid request method!'}, status=405)
    try:
        data = json.loads(request.body)
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        if not all([username, email, password]):
            logger.warning('User registration attempt with missing fields')
            return JsonResponse({
                'success': False, 
                'message': 'Username, email, and password are required!'
            }, status=400)
        if '@' not in email or '.' not in email:
            logger.warning(f'Invalid email format: {email}')
            return JsonResponse({
                'success': False, 
                'message': 'Invalid email format!'
            }, status=400)
        if len(password) < 6:
            return JsonResponse({
                'success': False, 
                'message': 'Password must be at least 6 characters long!'
            }, status=400)
        if User.objects.filter(username=username).exists():
            logger.warning(f'Duplicate username attempt: {username}')
            return JsonResponse({
                'success': False, 
                'message': 'Username already taken!'
            }, status=400)
        if User.objects.filter(email=email).exists():
            logger.warning(f'Duplicate email attempt: {email}')
            return JsonResponse({
                'success': False, 
                'message': 'Email already registered!'
            }, status=400)
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )
        logger.info(f'User registered successfully: {username}')
        return JsonResponse({
            'success': True, 
            'message': 'User registered successfully!'
        }, status=201)
    except json.JSONDecodeError:
        logger.error('Invalid JSON in registration request')
        return JsonResponse({
            'success': False, 
            'message': 'Invalid JSON format!'
        }, status=400)
    except DatabaseError as e:
        logger.error(f'Database error during registration: {str(e)}')
        return JsonResponse({
            'success': False, 
            'message': 'Database error occurred'
        }, status=500)
    except Exception as e:
        logger.error(f'Error registering user: {str(e)}')
        return JsonResponse({
            'success': False, 
            'message': 'An error occurred during registration'
        }, status=500)

@api_view(['GET'])
def get_news_by_category(request, category):
    try:
        if not category or len(category) > 50:
            logger.warning(f'Invalid category request: {category}')
            return Response({'success': False, 'message': 'Invalid category'}, status=status.HTTP_400_BAD_REQUEST)
        news = News.objects.filter(category=category)
        serializer = NewsSerializer(news, many=True, context={'request': request})
        logger.info(f'Fetched {len(news)} news items for category: {category}')
        return Response({'success': True, 'data': serializer.data}, status=status.HTTP_200_OK)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news by category: {str(e)}')
        return Response({'success': False, 'message': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error fetching news by category: {str(e)}')
        return Response({'success': False, 'message': 'An error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request, user_id):
    try:
        if not user_id or not str(user_id).isdigit():
            logger.warning(f'Invalid user_id: {user_id}')
            return Response({
                "status": "error", 
                "message": "Invalid user ID"
            }, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.get(id=user_id)
        serializer = UserSerializer(user)
        logger.info(f'User details fetched: {user_id}')
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        logger.warning(f'User not found: {user_id}')
        return Response({
            "status": "error", 
            "message": "User not found"
        }, status=status.HTTP_404_NOT_FOUND)
    except DatabaseError as e:
        logger.error(f'Database error while fetching user details: {str(e)}')
        return Response({
            "status": "error", 
            "message": "Database error occurred"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error fetching user details: {str(e)}')
        return Response({
            "status": "error", 
            "message": "An error occurred"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_details(request):
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        if not user_id or not str(user_id).isdigit():
            logger.warning(f'Invalid user_id for update: {user_id}')
            return Response({
                "status": "error", 
                "message": "User ID is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.warning(f'User not found for update: {user_id}')
            return Response({
                "status": "error", 
                "message": "User not found"
            }, status=status.HTTP_404_NOT_FOUND)
        new_email = data.get('email', user.email).strip()
        if new_email != user.email:
            if User.objects.filter(email=new_email).exclude(id=user_id).exists():
                logger.warning(f'Email already exists: {new_email}')
                return Response({
                    "status": "error", 
                    "message": "Email already exists"
                }, status=status.HTTP_400_BAD_REQUEST)
        user.first_name = data.get('first_name', user.first_name).strip()
        user.last_name = data.get('last_name', user.last_name).strip()
        user.username = data.get('username', user.username).strip()
        user.email = new_email
        password = data.get('password', '').strip()
        if password:
            if len(password) < 6:
                return Response({
                    "status": "error", 
                    "message": "Password must be at least 6 characters"
                }, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(password)
        user.save()
        serializer = UserSerializer(user)
        logger.info(f'User details updated: {user_id}')
        return Response({
            "status": "success", 
            "message": "User details updated successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    except json.JSONDecodeError:
        logger.error('Invalid JSON in update_user_details request')
        return Response({
            "status": "error", 
            "message": "Invalid JSON format"
        }, status=status.HTTP_400_BAD_REQUEST)
    except DatabaseError as e:
        logger.error(f'Database error while updating user: {str(e)}')
        return Response({
            "status": "error", 
            "message": "Database error occurred"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        logger.error(f'Error updating user details: {str(e)}')
        return Response({
            "status": "error", 
            "message": "An error occurred while updating user"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@csrf_exempt
def logoutUser(request):
    if request.method != 'POST':
        logger.warning(f'Invalid request method for logout: {request.method}')
        return JsonResponse({
            'success': False, 
            'message': 'Only POST requests are allowed'
        }, status=405)
    try:
        data = json.loads(request.body)
        refresh_token = data.get('refresh_token')
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
                logger.info('JWT token blacklisted successfully')
            except Exception as token_error:
                logger.warning(f'Token blacklist error: {str(token_error)}')
        logout(request)
        request.session.flush()
        logger.info('User logged out successfully')
        return JsonResponse({
            'success': True, 
            'message': 'Logout successful'
        }, status=200)
    except json.JSONDecodeError:
        logout(request)
        request.session.flush()
        return JsonResponse({
            'success': True, 
            'message': 'Logout successful'
        }, status=200)
    except Exception as e:
        logger.error(f'Logout error: {str(e)}')
        return JsonResponse({
            'success': False, 
            'message': 'An error occurred during logout'
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_password(request):
    if request.method != 'POST':
        logger.warning(f'Invalid request method for reset_password: {request.method}')
        return JsonResponse({
            "status": "error", 
            "message": "Invalid request method"
        }, status=405)
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        new_password = data.get('new_password', '').strip()
        if not user_id or not new_password:
            logger.warning('Password reset attempt with missing fields')
            return JsonResponse({
                "status": "error", 
                "message": "User ID and new password are required"
            }, status=400)
        if len(new_password) < 6:
            return JsonResponse({
                "status": "error", 
                "message": "Password must be at least 6 characters long"
            }, status=400)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.warning(f'User not found for password reset: {user_id}')
            return JsonResponse({
                "status": "error", 
                "message": "User not found"
            }, status=404)
        user.set_password(new_password)
        user.save()
        logger.info(f'Password reset successfully for user: {user_id}')
        return JsonResponse({
            "status": "success", 
            "message": "Password reset successfully"
        }, status=200)
    except json.JSONDecodeError:
        logger.error('Invalid JSON in reset_password request')
        return JsonResponse({
            "status": "error", 
            "message": "Invalid JSON format"
        }, status=400)
    except DatabaseError as e:
        logger.error(f'Database error during password reset: {str(e)}')
        return JsonResponse({
            "status": "error", 
            "message": "Database error occurred"
        }, status=500)
    except Exception as e:
        logger.error(f'Error resetting password: {str(e)}')
        return JsonResponse({
            "status": "error", 
            "message": "An error occurred while resetting password"
        }, status=500)

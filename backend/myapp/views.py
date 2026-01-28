from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import logging
from .models import News, Advertisement
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
    if request.method != 'POST':
        logger.warning(f'Invalid request method for add_news: {request.method}')
        return JsonResponse({'success': False, 'message': 'Invalid request method!'}, status=405)
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
            return JsonResponse({
                'success': False, 
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }, status=400)
        if len(title) > 500:
            return JsonResponse({'success': False, 'message': 'Title too long (max 500 characters)'}, status=400)
        if len(description) > 500:
            return JsonResponse({'success': False, 'message': 'Description too long (max 500 characters)'}, status=400)
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
        logger.info(f'News created successfully: {news.id} - {title}')
        return JsonResponse({
            'success': True, 
            'message': 'News added successfully!', 
            'news_id': news.id
        }, status=201)
    except DatabaseError as e:
        logger.error(f'Database error while adding news: {str(e)}')
        return JsonResponse({'success': False, 'message': 'Database error occurred'}, status=500)
    except Exception as e:
        logger.error(f'Error adding news: {str(e)}')
        return JsonResponse({'success': False, 'message': 'An error occurred while adding news'}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def add_adv(request):
    if request.method != 'POST':
        logger.warning(f'Invalid request method for add_adv: {request.method}')
        return JsonResponse({'success': False, 'message': 'Invalid request method!'}, status=405)
    try:
        title = request.POST.get('title', '').strip()
        description = request.POST.get('description', '').strip()
        content = request.POST.get('content', '').strip()
        image = request.FILES.get('image')
        if not all([title, description, content]):
            logger.warning('Missing required fields for advertisement')
            return JsonResponse({'success': False, 'message': 'Title, description, and content are required!'}, status=400)
        ad = Advertisement.objects.create(
            title=title,
            description=description,
            content=content,
            image=image,
        )
        logger.info(f'Advertisement created successfully: {ad.id} - {title}')
        return JsonResponse({'success': True, 'message': 'Advertisement added successfully!'}, status=201)
    except DatabaseError as e:
        logger.error(f'Database error while adding advertisement: {str(e)}')
        return JsonResponse({'success': False, 'message': 'Database error occurred'}, status=500)
    except Exception as e:
        logger.error(f'Error adding advertisement: {str(e)}')
        return JsonResponse({'success': False, 'message': 'An error occurred while adding advertisement'}, status=500)

@api_view(['GET'])
def fetch_all_news(request):
    if request.method != 'GET':
        logger.warning(f'Invalid request method for fetch_all_news: {request.method}')
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    try:
        news_items = News.objects.all()
        news_list = [
            {
                'id': news.id,
                'title': news.title,
                'description': news.description,
                'content': news.content,
                'category': news.category,
                'image_url': request.build_absolute_uri(news.image.url) if news.image else None,
                'time': news.time,
                'place': news.place,
                'author_name': news.author_name,
                'date_published': news.publication_date
            }
            for news in news_items
        ]
        logger.info(f'Fetched {len(news_list)} news items')
        return JsonResponse({'news': news_list}, status=200)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news: {str(e)}')
        return JsonResponse({'error': 'Database error occurred'}, status=500)
    except Exception as e:
        logger.error(f'Error fetching news: {str(e)}')
        return JsonResponse({'error': 'An error occurred while fetching news'}, status=500)

@api_view(['GET', 'DELETE'])
def get_delete_news(request, id):
    if request.method == 'DELETE' and not request.user.is_authenticated:
        return JsonResponse({'error': 'Authentication required'}, status=401)
    try:
        news = News.objects.get(id=id)
    except News.DoesNotExist:
        logger.warning(f'News item not found: {id}')
        return JsonResponse({'error': 'News item not found'}, status=404)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news: {str(e)}')
        return JsonResponse({'error': 'Database error occurred'}, status=500)
    try:
        if request.method == 'GET':
            return JsonResponse({
                'id': news.id,
                'title': news.title,
                'description': news.description,
                'content': news.content,
                'category': news.category,
                'image_url': request.build_absolute_uri(news.image.url) if news.image else None,
                'time': news.time,
                'place': news.place,
                'author_name': news.author_name,
                'author_image': request.build_absolute_uri(news.author_image.url) if news.author_image else None,
            }, status=200)
        elif request.method == 'DELETE':
            news_id = news.id
            news.delete()
            logger.info(f'News deleted successfully: {news_id}')
            return JsonResponse({'success': 'News deleted successfully'}, status=204)
        else:
            logger.warning(f'Invalid request method for get_delete_news: {request.method}')
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        logger.error(f'Error in get_delete_news: {str(e)}')
        return JsonResponse({'error': 'An error occurred'}, status=500)
from django.utils import timezone

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def news_update(request, id):
    try:
        news = News.objects.get(id=id)
    except News.DoesNotExist:
        logger.warning(f'News item not found for update: {id}')
        return JsonResponse({'success': False, 'message': 'News not found!'}, status=404)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news: {str(e)}')
        return JsonResponse({'success': False, 'message': 'Database error occurred'}, status=500)
    if request.method != 'POST':
        logger.warning(f'Invalid request method for news_update: {request.method}')
        return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=405)
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
        logger.info(f'News updated successfully: {id}')
        return JsonResponse({'success': True, 'message': 'News updated successfully!'}, status=200)
    except DatabaseError as e:
        logger.error(f'Database error while updating news: {str(e)}')
        return JsonResponse({'success': False, 'message': 'Database error occurred'}, status=500)
    except Exception as e:
        logger.error(f'Error updating news: {str(e)}')
        return JsonResponse({'success': False, 'message': 'An error occurred while updating news'}, status=500)

@api_view(['GET'])
def list_ads(request):
    if request.method == 'GET':
        ads_items = Advertisement.objects.all()
        ads_list = [
            {
                'id': ad.id,
                'title': ad.title,
                'description': ad.description,
                'content': ad.content,
                'image_url': request.build_absolute_uri(ad.image.url) if ad.image else None
            }
            for ad in ads_items
        ]
        return JsonResponse({'ads': ads_list}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def edit_ad(request, ad_id):
    try:
        ad = Advertisement.objects.get(id=ad_id)
    except Advertisement.DoesNotExist:
        return JsonResponse({'error': 'Advertisement not found'}, status=404)
    if request.method == 'GET':
        ad_data = {
            'id': ad.id,
            'title': ad.title,
            'description': ad.description,
            'content': ad.content,
            'image': ad.image.url if ad.image else None,
        }
        return JsonResponse(ad_data)
    elif request.method == 'DELETE':
        ad.delete()
        return JsonResponse({'success': 'News deleted successfully'}, status=204)

@api_view(['GET'])
def fetch_ad(request, id):
    if request.method == 'GET':
        try:
            ad = Advertisement.objects.get(id=id)
            ad_data = {
                'id': ad.id,
                'title': ad.title,
                'description': ad.description,
                'content': ad.content,
                'image_url': request.build_absolute_uri(ad.image.url) if ad.image else None
            }
            return JsonResponse(ad_data, status=200)
        except Advertisement.DoesNotExist:
            return JsonResponse({'error': 'Advertisement not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_ad(request, id):
    try:
        ad = Advertisement.objects.get(id=id)
    except Advertisement.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Ad not found!'}, status=404)
    ad.title = request.POST.get('title', ad.title)
    ad.description = request.POST.get('description', ad.description)
    ad.content = request.POST.get('content', ad.content)
    if 'image' in request.FILES:
        ad.image = request.FILES['image']
    ad.save()
    return JsonResponse({'success': True, 'message': 'Ad updated successfully!'}, status=200)

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
    news_item = get_object_or_404(News, id=id)
    news_data = {
        "id": news_item.id,
        "title": news_item.title,
        "description": news_item.description,
        "content": news_item.content,
        "image_url": request.build_absolute_uri(news_item.image.url) if news_item.image else None,
        "category": news_item.category,
        "date_published": news_item.publication_date,
        "author_name":news_item.author_name,
        'author_image':request.build_absolute_uri(news_item.author_image.url) if news_item.author_image else None,
        'place':news_item.place,
    }
    return JsonResponse(news_data, status=200)

@api_view(['GET'])
def ad_list(request):
    ads = Advertisement.objects.all()
    ads_data = []
    for ad in ads:
        ad_data = {
            'id': ad.id,
            'title': ad.title,
            'description': ad.description,
            'content': ad.content,
            'publication_date': ad.publication_date.isoformat(),
            'image_url': request.build_absolute_uri(ad.image.url) if ad.image else None,
        }
        ads_data.append(ad_data)
    return JsonResponse({'ads': ads_data})
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
            return JsonResponse({'success': False, 'message': 'Invalid category'}, status=400)
        news = News.objects.filter(category=category)
        news_list = []
        for item in news:
            news_list.append({
                'id': item.id,
                'title': item.title,
                'description': item.description,
                'content': item.content,
                'category': item.category,
                'date_published': item.publication_date,
                'image_url': request.build_absolute_uri(item.image.url) if item.image else None,
                'author_name': item.author_name,
                'author_image': request.build_absolute_uri(item.author_image.url) if item.author_image else None,
                'time': item.time,
                'place': item.place
            })
        logger.info(f'Fetched {len(news_list)} news items for category: {category}')
        return JsonResponse({'success': True, 'data': news_list}, status=200)
    except DatabaseError as e:
        logger.error(f'Database error while fetching news by category: {str(e)}')
        return JsonResponse({'success': False, 'message': 'Database error occurred'}, status=500)
    except Exception as e:
        logger.error(f'Error fetching news by category: {str(e)}')
        return JsonResponse({'success': False, 'message': 'An error occurred'}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_details(request, user_id):
    if request.method != 'GET':
        logger.warning(f'Invalid request method for get_user_details: {request.method}')
        return JsonResponse({
            "status": "error", 
            "message": "Invalid request method"
        }, status=405)
    try:
        if not user_id or not str(user_id).isdigit():
            logger.warning(f'Invalid user_id: {user_id}')
            return JsonResponse({
                "status": "error", 
                "message": "Invalid user ID"
            }, status=400)
        user = User.objects.get(id=user_id)
        data = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "email": user.email
        }
        logger.info(f'User details fetched: {user_id}')
        return JsonResponse({"status": "success", "data": data}, status=200)
    except User.DoesNotExist:
        logger.warning(f'User not found: {user_id}')
        return JsonResponse({
            "status": "error", 
            "message": "User not found"
        }, status=404)
    except DatabaseError as e:
        logger.error(f'Database error while fetching user details: {str(e)}')
        return JsonResponse({
            "status": "error", 
            "message": "Database error occurred"
        }, status=500)
    except Exception as e:
        logger.error(f'Error fetching user details: {str(e)}')
        return JsonResponse({
            "status": "error", 
            "message": "An error occurred"
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_details(request):
    if request.method != 'POST':
        logger.warning(f'Invalid request method for update_user_details: {request.method}')
        return JsonResponse({
            "status": "error", 
            "message": "Invalid request method"
        }, status=405)
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id')
        if not user_id or not str(user_id).isdigit():
            logger.warning(f'Invalid user_id for update: {user_id}')
            return JsonResponse({
                "status": "error", 
                "message": "User ID is required"
            }, status=400)
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.warning(f'User not found for update: {user_id}')
            return JsonResponse({
                "status": "error", 
                "message": "User not found"
            }, status=404)
        new_email = data.get('email', user.email).strip()
        if new_email != user.email:
            if User.objects.filter(email=new_email).exclude(id=user_id).exists():
                logger.warning(f'Email already exists: {new_email}')
                return JsonResponse({
                    "status": "error", 
                    "message": "Email already exists"
                }, status=400)
        user.first_name = data.get('first_name', user.first_name).strip()
        user.last_name = data.get('last_name', user.last_name).strip()
        user.username = data.get('username', user.username).strip()
        user.email = new_email
        password = data.get('password', '').strip()
        if password:
            if len(password) < 6:
                return JsonResponse({
                    "status": "error", 
                    "message": "Password must be at least 6 characters"
                }, status=400)
            user.set_password(password)
        user.save()
        logger.info(f'User details updated: {user_id}')
        return JsonResponse({
            "status": "success", 
            "message": "User details updated successfully"
        }, status=200)
    except json.JSONDecodeError:
        logger.error('Invalid JSON in update_user_details request')
        return JsonResponse({
            "status": "error", 
            "message": "Invalid JSON format"
        }, status=400)
    except DatabaseError as e:
        logger.error(f'Database error while updating user: {str(e)}')
        return JsonResponse({
            "status": "error", 
            "message": "Database error occurred"
        }, status=500)
    except Exception as e:
        logger.error(f'Error updating user details: {str(e)}')
        return JsonResponse({
            "status": "error", 
            "message": "An error occurred while updating user"
        }, status=500)

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

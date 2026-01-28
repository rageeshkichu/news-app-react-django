from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import News,Advertisement
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view
from django.views.decorators.http import require_http_methods
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required


@csrf_exempt  # Disable CSRF for this view (only for testing or APIs that don't need CSRF protection)
def loginUser(request):
    if request.method == 'POST':
        # Parse the JSON request body
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        # Debugging: Print the received username and password
        print(f"Attempting login for username: {username}")

        # Authenticate user
        user = authenticate(request, username=username, password=password)

        # Check if user authentication was successful
        if user is not None:
            print(f"User {username} authenticated successfully")

            # Log the user in
            login(request, user)

            # Store the user ID in the session (Django handles session automatically)
            request.session['user_id'] = user.id

            # Retrieve user ID and is_superuser status
            user_id = user.id  # Get the user ID
            is_superuser = user.is_superuser  # Check if user is a superuser

            # Debugging: Print user ID and superuser status
            print(f"User ID: {user_id}, Is Superuser: {is_superuser}")

            # Return success response along with 'is_superuser' status and 'user_id'
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'is_superuser': is_superuser,
                'user_id': user_id  # Include user ID in the response
            })

        else:
            print(f"Authentication failed for username: {username}")  # Debugging if authentication fails
            return JsonResponse({'success': False, 'message': 'Invalid username or password'}, status=401)

    return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'}, status=405)


@csrf_exempt
def add_news(request):
    if request.method == 'POST':
        # Extract fields from the POST request
        title = request.POST.get('title')
        description = request.POST.get('description')
        content = request.POST.get('content')
        category = request.POST.get('category', 'general')  # Default to 'general'
        image = request.FILES.get('image')
        
        # Additional fields
        author_name = request.POST.get('authorName')
        author_image = request.FILES.get('authorImage')
        time = request.POST.get('time')
        place = request.POST.get('place')
        print(image)
        print(author_image)

        # Validate required fields
        if not all([title, description, content, author_name, time, place]):
            return JsonResponse({'success': False, 'message': 'Missing required fields!'}, status=400)

        # Create the news instance
        try:
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
            return JsonResponse({'success': True, 'message': 'News added successfully!', 'news_id': news.id})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Error: {str(e)}'}, status=500)

    return JsonResponse({'success': False, 'message': 'Invalid request method!'}, status=400)


@csrf_exempt
def add_adv(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        description = request.POST.get('description')
        content = request.POST.get('content')
        image = request.FILES.get('image')

        if title and description and content:
            news = Advertisement.objects.create(
                title=title,
                description=description,
                content=content,
                image=image,
            )
            return JsonResponse({'success': True, 'message': 'Advertisement added successfully!'})
        else:
            return JsonResponse({'success': False, 'message': 'Missing fields!'}, status=400)

    return JsonResponse({'success': False, 'message': 'Invalid request method!'}, status=400)


@csrf_exempt
def fetch_all_news(request):
    if request.method == 'GET':
        news_items = News.objects.all()
        news_list = [
            {
                'id': news.id,
                'title': news.title,
                'description': news.description,
                'content': news.content,
                'category': news.category,  # Add category here
                'image_url': request.build_absolute_uri(news.image.url) if news.image else None,
                'time':news.time,
                'place':news.place,
                'author_name':news.author_name,
                'date_published':news.publication_date
            }
            for news in news_items
        ]
        return JsonResponse({'news': news_list}, status=200)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
def get_delete_news(request, id):
    try:
        news = News.objects.get(id=id)
    except News.DoesNotExist:
        return JsonResponse({'error': 'News item not found'}, status=404)

    if request.method == 'GET':
        return JsonResponse({
            'id': news.id,
            'title': news.title,
            'description': news.description,
            'content': news.content,
            'category': news.category,
            'image_url': news.image.url if news.image else None,
            'time':news.time,
            'place':news.place,
            'authorName':news.author_name,
            'authorImage':news.author_image.url if news.author_image else None,
        }, status=200)

    elif request.method == 'DELETE':
        news.delete()
        return JsonResponse({'success': 'News deleted successfully'}, status=204)


    return JsonResponse({'error': 'Invalid request method'}, status=405)

from django.utils import timezone
@csrf_exempt
def news_update(request, id):
    try:
        news = News.objects.get(id=id)
    except News.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'News not found!'}, status=404)

    # Update fields if provided in the request
    news.title = request.POST.get('title', news.title)
    news.description = request.POST.get('description', news.description)
    news.content = request.POST.get('content', news.content)
    news.category = request.POST.get('category', news.category)
    news.time = request.POST.get('time', news.time)
    news.place = request.POST.get('place', news.place)
    news.author_name = request.POST.get('authorName', news.author_name)

    # Handle image update
    if 'image' in request.FILES:
        news.image = request.FILES['image']

    # Handle author image update
    if 'author_image' in request.FILES:
        news.author_image = request.FILES['authorImage']

    news.publication_date = timezone.now()

    news.save()  # Save the updated news instance
    return JsonResponse({'success': True, 'message': 'News updated successfully!'}, status=200)

@csrf_exempt  # This is necessary to allow POST requests without CSRF token (for testing purposes)
def list_ads(request):
    if request.method == 'GET':
        ads_items = Advertisement.objects.all()  # Fetch all advertisements
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
    
@csrf_exempt
def edit_ad(request, ad_id):
    """Fetch and edit an advertisement."""
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
            'image': ad.image.url if ad.image else None,  # Get image URL if available
        }
        return JsonResponse(ad_data)

    elif request.method == 'DELETE':
        ad.delete()
        return JsonResponse({'success': 'News deleted successfully'}, status=204)
        

@csrf_exempt
def fetch_ad(request, id):
    if request.method == 'GET':
        try:
            ad = Advertisement.objects.get(id=id)  # Fetch the advertisement by ID
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


@csrf_exempt
def update_ad(request, id):
    try:
        ad = Advertisement.objects.get(id=id)
    except Advertisement.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Ad not found!'}, status=404)

    # Update fields if provided in the request
    ad.title = request.POST.get('title', ad.title)
    ad.description = request.POST.get('description', ad.description)
    ad.content = request.POST.get('content', ad.content)

    # Handle image update
    if 'image' in request.FILES:
        ad.image = request.FILES['image']

    ad.save()  # Save the updated advertisement instance
    return JsonResponse({'success': True, 'message': 'Ad updated successfully!'}, status=200)

@csrf_exempt
@api_view(['GET'])
def news_count(request):
    count = News.objects.count()
    return JsonResponse({'count': count})

@csrf_exempt
@api_view(['GET'])
def ads_count(request):
    count = Advertisement.objects.count()
    return JsonResponse({'count': count})



@csrf_exempt
def get_news(request):
    try:
        # Fetch all news
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
                'pubDate': news.pubDate.strftime('%Y-%m-%d %H:%M:%S'),  # Formatting the datetime field
            })

        return JsonResponse({'results': news_data})

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


# View to fetch all ads
@csrf_exempt
def get_ads(request):
    try:
        # Fetch all ads
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
    

@csrf_exempt
def news_detail(request, id):
    news_item = get_object_or_404(News, id=id)  # Fetch the news item by id
    news_data = {
        "id": news_item.id,
        "title": news_item.title,
        "description": news_item.description,
        "content": news_item.content,  # Full content of the news article
        "image_url": request.build_absolute_uri(news_item.image.url) if news_item.image else None,
        "category": news_item.category,
        "date_published": news_item.publication_date,
        "author_name":news_item.author_name,
        'author_image':request.build_absolute_uri(news_item.author_image.url) if news_item.author_image else None,
        'place':news_item.place,
    }
    return JsonResponse(news_data, status=200)

@csrf_exempt
def ad_list(request):
    # Fetch all advertisements, ordered by publication date (newest first)
    ads = Advertisement.objects.all()
    
    ads_data = []
    for ad in ads:
        ad_data = {
            'id': ad.id,
            'title': ad.title,
            'description': ad.description,
            'content': ad.content,
            'publication_date': ad.publication_date.isoformat(),
            'image_url': ad.image.url if ad.image else None,  # Handling image URL
        }
        ads_data.append(ad_data)
    
    return JsonResponse({'ads': ads_data})


@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        try:
            # Parse the JSON body of the request
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', '2')  # Default role value if not provided

            # Print the retrieved data for debugging
            print(f"Username: {username}, Email: {email}, Password: {password}")

            # Check if all required fields are present
            if not username or not email or not password:
                return JsonResponse({'success': False, 'message': 'All fields are required!'}, status=400)

            # Check if the user already exists
            if User.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'message': 'Username already taken!'}, status=400)
            if User.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Email already registered!'}, status=400)

            # Create a new user
            user = User.objects.create(
                username=username,
                email=email,
                password=make_password(password)  # Hash the password for security
            )

            # Optionally, you can add a Profile model to store the role if needed
            # Assuming you have a Profile model with a role field
            # user.profile.role = role
            # user.save()

            # Return success response
            return JsonResponse({'success': True, 'message': 'User registered successfully!'})

        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON data!'}, status=400)

    return JsonResponse({'success': False, 'message': 'Invalid request method!'}, status=405)



def get_news_by_category(request, category):
    # Filter news by the category
    news = News.objects.filter(category=category)
    news_list = []
    
    # Serialize news data (you can customize this to match your News model)
    for item in news:
        news_list.append({
            'id':item.id,
            'title': item.title,
            'description': item.description,
            'content':item.content,
            'date_published': item.publication_date,
            'image': request.build_absolute_uri(item.image.url) if item.image else None  # assuming image is in the model
        })
    
    return JsonResponse({'success': True, 'data': news_list})

@csrf_exempt
def get_user_details(request, user_id):
    if request.method == "GET":
        try:
            # Fetch the user by user_id
            user = User.objects.get(id=user_id)
            print(user)

            # Prepare the data to return
            data = {
                "first_name": user.first_name,
                "last_name": user.last_name,
                "username": user.username,
                "email": user.email,
                "password":user.password
            }
            return JsonResponse({"status": "success", "data": data}, status=200)

        except User.DoesNotExist:
            return JsonResponse({"status": "error", "message": "User not found"}, status=404)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)

@csrf_exempt
def update_user_details(request):
    if request.method == "POST":
        try:
            print("Received POST request")  # Debugging
            # Load the JSON data from the request body
            data = json.loads(request.body)
            
            # Extract the user_id from the request data
            user_id = data.get("user_id")
            print(f"Received user_id: {user_id}")  # Debugging

            if not user_id:
                return JsonResponse({"status": "error", "message": "User ID is required"}, status=400)

            # Fetch the user by user_id
            try:
                user = User.objects.get(id=user_id)
                print(f"Found user: {user}")  # Debugging
            except User.DoesNotExist:
                return JsonResponse({"status": "error", "message": "User not found"}, status=404)

            # Verify if the provided email already exists (excluding the current user)
            new_email = data.get("email", user.email)
            if User.objects.filter(email=new_email).exclude(id=user_id).exists():
                return JsonResponse({"status": "error", "message": "Email already exists"})

            # Update the user's fields with the provided data
            user.first_name = data.get("first_name", user.first_name)
            user.last_name = data.get("last_name", user.last_name)
            user.username = data.get("username", user.username)
            user.email = new_email

            # Update password only if provided
            if "password" in data and data["password"]:
                user.set_password(data["password"])

            # Save the updated user object
            user.save()

            return JsonResponse({"status": "success", "message": "User details updated successfully"}, status=200)

        except Exception as e:
            print(f"Error: {e}")  # Debugging
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)


@csrf_exempt  # Disable CSRF for this view (only for testing or APIs that don't need CSRF protection)
def logoutUser(request):
    if request.method == 'POST':
        try:
            # Log out the user and clear the session
            logout(request)

            # Optionally, you can clear the user ID from the session explicitly, 
            # but Django will automatically handle it when `logout(request)` is called
            request.session.flush()

            return JsonResponse({'success': True, 'message': 'Logout successful'}, status=200)

        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'}, status=405)


@csrf_exempt
def reset_password(request):
    if request.method == "POST":
        try:
            print("Received POST request")  # Debugging
            # Load the JSON data from the request body
            data = json.loads(request.body)

            # Extract the user_id and new_password from the request data
            user_id = data.get("user_id")
            new_password = data.get("new_password")

            print(f"Received user_id: {user_id}, new_password: {new_password}")  # Debugging

            if not user_id or not new_password:
                return JsonResponse(
                    {"status": "error", "message": "User ID and new password are required"},
                    status=400
                )

            # Fetch the user by user_id
            try:
                user = User.objects.get(id=user_id)
                print(f"Found user: {user}")  # Debugging
            except User.DoesNotExist:
                return JsonResponse({"status": "error", "message": "User not found"}, status=404)

            # Update the user's password
            user.password = make_password(new_password)
            user.save()

            print("Password updated successfully")  # Debugging
            return JsonResponse({"status": "success", "message": "Password reset successfully"}, status=200)

        except Exception as e:
            print(f"Error: {e}")  # Debugging
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=400)

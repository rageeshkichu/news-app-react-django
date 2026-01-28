from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView
urlpatterns = [
    path('api/loginUser/', views.loginUser, name='loginUser'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path("api/logout/", views.logoutUser, name="logout"),
    path('api/register/', views.register_user, name='register_user'),
    path('api/reset-password/', views.reset_password, name='reset_password'),
    path('api/addNews/', views.add_news, name='add_news'),
    path('api/news/', views.fetch_all_news, name='fetch_all_news'),
    path('api/news/<int:id>/', views.get_delete_news, name='get_delete_update_news'),
    path('api/newss/<int:id>/', views.news_update, name='news_update'),
    path('api/news/count/', views.news_count, name='news_count'),
    path('api/usernews/', views.get_news, name='get_news'),
    path('api/newsdetails/<int:id>/', views.news_detail, name='news_detail'),
    path('api/news/category/<str:category>/', views.get_news_by_category, name='get_news_by_category'),
    path('api/addAdv/', views.add_adv, name='add_adv'),
    path('api/ads/', views.list_ads, name='list-ads'),
    path('api/ads/<int:ad_id>/', views.edit_ad, name='edit-ad'),
    path('api/adv/<int:id>/', views.fetch_ad, name='fetch_ad'),
    path('api/advv/<int:id>/', views.update_ad, name='fetch_ad'),
    path('api/ads/count/', views.ads_count, name='ads_count'),
    path('api/userads/', views.ad_list, name='ads-list'),
    path('api/get-userprofile-details/<int:user_id>/', views.get_user_details, name='get_user_details'),
    path('api/update-user-details/', views.update_user_details, name='update_user_details'),
]
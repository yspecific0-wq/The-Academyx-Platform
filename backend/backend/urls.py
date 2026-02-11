from django.contrib import admin

from django.urls import path, include

from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [

    path("admin/", admin.site.urls),



    path("api/", include("accounts.urls")),

    path("api/", include("schools.urls")),

    path("api/", include("user_notifications.urls")),

    # REGISTER THE NEW APP HERE

    path('api/attendance/', include('attendance.urls')),

    path('api/accounts/', include('accounts.urls')),



    # ✅ JWT refresh

    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

]
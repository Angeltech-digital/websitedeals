from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, OrderViewSet
router = DefaultRouter()
router.register('products', ProductViewSet)
router.register('orders', OrderViewSet)
urlpatterns = [
    path('', include(router.urls)),
]

from .views import CartViewSet, CartItemViewSet, CheckoutView

router.register('carts', CartViewSet)
router.register('cart-items', CartItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
]

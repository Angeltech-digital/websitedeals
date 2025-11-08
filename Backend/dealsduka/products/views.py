from rest_framework import viewsets, filters, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from django.shortcuts import get_object_or_404
from accounts.permissions import IsAdminOrReadOnly

from .models import Category, Product, Order, Cart, CartItem, OrderItem, InventoryLog
from .serializers import (
    CategorySerializer,
    ProductSerializer,
    OrderSerializer,
    CartSerializer,
    CartItemSerializer,
)
from .serializers import (
    ProductSerializer,
    OrderSerializer,
    CartSerializer,
    CartItemSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all().order_by('-updated_at')
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            return Cart.objects.filter(user=user).order_by('-updated_at')
        return Cart.objects.none()


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        cart = None
        user = self.request.user
        if user and user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=user)
        else:
            # For anonymous, require cart in payload (not recommended for production)
            cart_id = self.request.data.get('cart')
            cart = get_object_or_404(Cart, pk=cart_id)
        serializer.save(cart=cart)


class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user).first()
        if not cart:
            return Response({'detail': 'No cart found for user.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            # Lock products to avoid race conditions
            product_ids = [ci.product_id for ci in cart.items.select_related('product')]
            products = Product.objects.select_for_update().filter(id__in=product_ids)
            prod_map = {p.id: p for p in products}

            order = Order.objects.create(user=user, total=0)
            total = 0
            for ci in cart.items.select_related('product').all():
                product = prod_map.get(ci.product_id)
                if not product:
                    transaction.set_rollback(True)
                    return Response({'detail': f'Product {ci.product_id} not found'}, status=status.HTTP_400_BAD_REQUEST)
                if product.stock < ci.quantity:
                    transaction.set_rollback(True)
                    return Response({'detail': f'Insufficient stock for {product.name}'}, status=status.HTTP_400_BAD_REQUEST)
                price = product.price
                subtotal = price * ci.quantity
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    name=product.name,
                    price=price,
                    quantity=ci.quantity,
                    subtotal=subtotal,
                )
                # decrement stock
                product.stock -= ci.quantity
                product.save()
                InventoryLog.objects.create(product=product, change=-ci.quantity, reason='sale', related_order=order)
                total += subtotal

            order.total = total
            order.status = 'confirmed'
            order.save()
            # clear cart
            cart.items.all().delete()

        serializer = OrderSerializer(order, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-created_at')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

# Generated by Django 5.2.4 on 2025-07-04 19:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('location', models.CharField(max_length=200)),
                ('property_type', models.CharField(choices=[('house', 'House'), ('apartment', 'Apartment'), ('condo', 'Condo'), ('commercial', 'Commercial')], default='house', max_length=20)),
                ('bedrooms', models.PositiveIntegerField(default=0)),
                ('bathrooms', models.DecimalField(decimal_places=1, default=0, max_digits=3)),
                ('area', models.PositiveIntegerField(help_text='Area in square feet')),
                ('image', models.ImageField(blank=True, null=True, upload_to='properties/')),
                ('is_sold', models.BooleanField(default=False)),
                ('is_featured', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='properties', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': 'Properties',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PropertyFavorite',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorited_by', to='properties.property')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='favorites', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('user', 'property')},
            },
        ),
        migrations.CreateModel(
            name='PropertyPurchase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('purchase_date', models.DateTimeField(auto_now_add=True)),
                ('purchase_price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('completed', 'Completed'), ('cancelled', 'Cancelled')], default='pending', max_length=20)),
                ('notes', models.TextField(blank=True)),
                ('buyer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchases', to=settings.AUTH_USER_MODEL)),
                ('property', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchases', to='properties.property')),
            ],
            options={
                'ordering': ['-purchase_date'],
                'unique_together': {('property', 'buyer')},
            },
        ),
    ]

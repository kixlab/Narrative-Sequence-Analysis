# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-07 04:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('time_annotation', '0017_novel_summary'),
    ]

    operations = [
        migrations.AddField(
            model_name='time_block',
            name='_id',
            field=models.IntegerField(default=0),
        ),
    ]

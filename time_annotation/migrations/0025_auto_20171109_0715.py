# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-09 07:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('time_annotation', '0024_auto_20171108_1253'),
    ]

    operations = [
        migrations.RenameField(
            model_name='time_block_pairwise_comparison',
            old_name='_prev',
            new_name='block_a',
        ),
        migrations.RenameField(
            model_name='time_block_pairwise_comparison',
            old_name='not_sure',
            new_name='block_a_first',
        ),
        migrations.RenameField(
            model_name='time_block_pairwise_comparison',
            old_name='_next',
            new_name='block_b',
        ),
        migrations.RenameField(
            model_name='time_block_pairwise_comparison',
            old_name='vote',
            new_name='block_b_first',
        ),
    ]

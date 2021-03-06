# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-09 08:22
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('time_annotation', '0027_auto_20171109_0726'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='work_result_flag',
            name='work_description',
        ),
        migrations.AddField(
            model_name='work_result_flag',
            name='_next',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='next_flag', to='time_annotation.Time_Block'),
        ),
        migrations.AddField(
            model_name='work_result_flag',
            name='_prev',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='prev_flag', to='time_annotation.Time_Block'),
        ),
        migrations.AddField(
            model_name='work_result_flag',
            name='certainty_score',
            field=models.IntegerField(default=-1),
        ),
        migrations.AddField(
            model_name='work_result_flag',
            name='important_blocks_position',
            field=models.IntegerField(default=-1),
        ),
    ]

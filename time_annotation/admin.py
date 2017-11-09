from django.contrib import admin
from .models import Novel, Meta_Novel_Sequence, Time_Block, Time_Block_Position_Vote, Time_Block_Pairwise_Comparison, Brute_Time_Block_Pairwise_Comparison, Work_Result_Brute,UnDef_Work_Result_Putter,Def_Work_Result_Putter, Work_Result_Flag
from .models import Work_Result_Putter
# Register your models here.

admin.site.register(Novel)
admin.site.register(Meta_Novel_Sequence)
admin.site.register(Time_Block)
admin.site.register(Time_Block_Position_Vote)
admin.site.register(Time_Block_Pairwise_Comparison)
admin.site.register(Brute_Time_Block_Pairwise_Comparison)
admin.site.register(Work_Result_Brute)
admin.site.register(Def_Work_Result_Putter)
admin.site.register(UnDef_Work_Result_Putter)
admin.site.register(Work_Result_Flag)
admin.site.register(Work_Result_Putter)

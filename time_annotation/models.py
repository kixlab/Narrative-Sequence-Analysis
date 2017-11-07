from django.db import models

# Create your models here.
class Novel(models.Model):
    Novel_title = models.CharField(max_length = 200)
    Novel_Text = models.TextField(max_length = 100000)
    Novel_num_of_groups = models.IntegerField(default = 0)
    cur_group_num = models.IntegerField(default = 0)
    Novel_num_of_trivial_time_blocks = models.IntegerField(default = 0)
    cur_time_block_num = models.IntegerField(default = 0)
    Summary = models.TextField(max_length = 10000, default="")
    def __str__(self):
        return self.Novel_title

class Meta_Novel_Sequence(models.Model):
    Novel = models.ForeignKey(Novel,null=True, on_delete=models.SET_NULL)
    is_beginning = models.BooleanField(default = False)
    start_sen_num = models.IntegerField(default=-1)
    end_sen_num = models.IntegerField(default=-1)
    summary = models.TextField(max_length = 2000)
    def __str__(self):
        return self.Novel.Novel_title+" sequence "+str(self.start_sen_num)

class Time_Block(models.Model):
    Time_Block_Summary = models.TextField(max_length = 10000)
    Time_Block_Full_Text = models.TextField(max_length = 100000)
    Seq_Num = models.IntegerField(default=0)
    Important_Seq = models.IntegerField(default=-1)
    Important_Seq_group_num = models.IntegerField(default=-1)
    Novel = models.ForeignKey(Novel, null=True, on_delete=models.SET_NULL)
    _id = models.IntegerField(default=0)
    def __str__(self):
        return str(self._id)

class Time_Block_Position_Vote(models.Model):
    time_block = models.ForeignKey(Time_Block, null=True, on_delete=models.SET_NULL)
    Important_Seq_group_num = models.IntegerField(default=-1)
    vote = models.IntegerField(default = 0)
    def __str__(self):
        return self.time_block.Time_Block_Summary+"_"+str(self.Important_Seq_group_num)
class Time_Block_Pairwise_Comparison(models.Model):
    Novel = models.ForeignKey(Novel, null=True, on_delete=models.SET_NULL)
    _prev = models.ForeignKey(Time_Block, null = True, on_delete = models.SET_NULL, related_name= 'prev')
    _next = models.ForeignKey(Time_Block, null = True, on_delete = models.SET_NULL, related_name= 'next')
    vote = models.IntegerField(default = 0)
    not_sure = models.IntegerField(default = 0)
    Important_Seq_group_num = models.IntegerField(default=-1)
    _id = models.IntegerField(default = 0)
    def __str__(self):
        return self.Novel.Novel_title+str(self.Important_Seq_group_num)+"_"+str(self._id)

class Brute_Time_Block_Pairwise_Comparison(models.Model):
    Novel = models.ForeignKey(Novel, null=True, on_delete=models.SET_NULL)
    _prev = models.ForeignKey(Time_Block, null = True, on_delete = models.SET_NULL, related_name= 'prev_brute')
    _next = models.ForeignKey(Time_Block, null = True, on_delete = models.SET_NULL, related_name= 'next_brute')
    vote = models.IntegerField(default = 0)
    not_sure = models.IntegerField(default = 0)
    _id = models.IntegerField(default = 0)
    def __str__(self):
        return self.Novel.Novel_title+str(self._id)

class Work_Result_Brute(models.Model):
    worker_id = models.TextField(max_length=1000, default="")
    work_description = models.TextField(max_length=1000, default="")
    def __str__(self):
        return self.work_description

class Work_Result_Putter(models.Model):
    worker_id = models.TextField(max_length=1000, default="")
    work_description = models.TextField(max_length=1000, default="")
    def __str__(self):
        return self.work_description

class Work_Result_Flag(models.Model):
    worker_id = models.TextField(max_length=1000, default="")
    work_description = models.TextField(max_length=1000, default="")
    def __str__(self):
        return self.work_description

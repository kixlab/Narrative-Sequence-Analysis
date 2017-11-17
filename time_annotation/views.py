from django.shortcuts import render
import json
import math
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.db.models import Sum, Max, Min, Count
from .models import Novel, Meta_Novel_Sequence, Time_Block, Time_Block_Position_Vote, Time_Block_Pairwise_Comparison, Brute_Time_Block_Pairwise_Comparison, Work_Result_Brute, Def_Work_Result_Putter, UnDef_Work_Result_Putter
from .models import Work_Result_Putter, Work_Result_Flag
from nltk.tokenize import sent_tokenize
from nltk.tokenize.punkt import PunktSentenceTokenizer
import random
# Create your views here.
def step1(request):
    return render(request, 'time_annotation/annotator.html', {})

def step2(request):
    return render(request, 'time_annotation/splitter.html', {})

def request(request):
    return render(request, 'time_annotation/request.html', {})

def putter(request):
    return render(request, 'time_annotation/putter.html', {})

def flag_comparison(request):
    return render(request, 'time_annotation/flag_comparison.html', {})

def brute_comparison(request):
    return render(request, 'time_annotation/brute_comparison.html', {})

def request_novel(request):
    Novel.objects.all().delete()
    title = request.GET.get("title")
    text = request.GET.get("text")
    #print(text)
    tokenizer = PunktSentenceTokenizer()
    text_sent_token = tokenizer.tokenize(text)
    #text_sent_token = sent_tokenize(text)
    num_of_groups=math.ceil(len(text_sent_token)/10)
    novel = Novel(Novel_Text = text, Novel_title = title, Novel_num_of_groups = num_of_groups)
    novel.save()
    data={}
    return JsonResponse(data)

def retrieve_novel(request):
    text_name = request.GET.get("text_name")
    #text_id = int(request.GET.get("text_id"))

    novel = Novel.objects.get(Novel_title = text_name)
    text_id = novel.cur_group_num
    novel.cur_group_num = text_id+1
    novel.save()
    tokenizer = PunktSentenceTokenizer()
    text_sent_token = tokenizer.tokenize(novel.Novel_Text)
#    text_sent_token = sent_tokenize(novel.Novel_Text)

    text_begin = novel.Novel_Text.find(text_sent_token[((text_id)%novel.Novel_num_of_groups)*10])
    text_end = novel.Novel_Text.find(text_sent_token[((text_id+3)%novel.Novel_num_of_groups)*10])
    print(text_begin)
    print(text_end)
    novel_part=""
    if text_begin < text_end:
        novel_part = novel.Novel_Text[int(text_begin): int(text_end)]
        for i in range(((text_id)%novel.Novel_num_of_groups)*10, ((text_id+3)%novel.Novel_num_of_groups)*10):
            b =novel_part.find(text_sent_token[i])
            e = b+len(text_sent_token[i])
            novel_part = novel_part[0:b]+"<a id='"+str(i)+"' class='sentence'>"+novel_part[b:e]+"</a>"+novel_part[e:]

        print(novel.Novel_Text[int(text_begin): int(text_end)])
    else:
        novel_part1 = novel.Novel_Text[int(text_begin):]
        for i in range(((text_id)%novel.Novel_num_of_groups)*10, len(text_sent_token)):
            b =novel_part1.find(text_sent_token[i])
            e = b+len(text_sent_token[i])
            novel_part1 = novel_part1[0:b]+"<a id='"+str(i)+"' class='sentence'>"+novel_part1[b:e]+"</a>"+novel_part1[e:]
        novel_part2 = novel.Novel_Text[:int(text_end)]
        for i in range(0, ((text_id+3)%novel.Novel_num_of_groups)*10):
            b =novel_part2.find(text_sent_token[i])
            e = b+len(text_sent_token[i])
            novel_part2 = novel_part2[0:b]+"<a id='"+str(i)+"' class='sentence'>"+novel_part2[b:e]+"</a>"+novel_part2[e:]
        novel_part = novel_part1 + "<div class='deselector'>\n\n\n</div>" + novel_part2
        print(novel.Novel_Text[text_begin:])
        print(novel.Novel_Text[0:text_end])
    #print(novel.Novel_Text)
    data={
        'novel_title': novel.Novel_title,
        'novel_text': novel_part,
    }
    return JsonResponse(data)

def retrieve_novel2(request):
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    tokenizer = PunktSentenceTokenizer()
    text_sent_token = tokenizer.tokenize(novel.Novel_Text)
    cur_split_num = 0

    meta_sequences = Meta_Novel_Sequence.objects.order_by("start_sen_num").all()
    sequence_list_start = []
    sequence_list_start.append(0)
    for meta_sequence in meta_sequences:
        if not meta_sequence.is_beginning and meta_sequence.start_sen_num not in sequence_list_start:
            sequence_list_start.append(meta_sequence.start_sen_num)
    print(sequence_list_start)
    tot_start_num = sequence_list_start[cur_split_num*4]
    if cur_split_num*4+3 is len(sequence_list_start)-1:
        tot_end_num = len(text_sent_token)-1
    else:
        tot_end_num = sequence_list_start[cur_split_num*4+4]-1
    b = novel.Novel_Text.find(text_sent_token[tot_start_num])
    e = novel.Novel_Text.find(text_sent_token[tot_end_num])+len(text_sent_token[tot_end_num])
    novel_part = novel.Novel_Text[b:e]
    for i in range(cur_split_num*4, cur_split_num*4+4):
        start_num = sequence_list_start[i]
        print(start_num)
        if i==len(sequence_list_start)-1:
            end_num = len(text_sent_token)-1
        else:
            end_num = sequence_list_start[i+1]-1
        print(end_num)
        b = novel_part.find(text_sent_token[start_num])
        e = novel_part.find(text_sent_token[end_num])+len(text_sent_token[end_num])
        print(b, e)
        print(text_sent_token[start_num])
        print(len(text_sent_token[start_num]))
        print(novel_part[b:b+len(text_sent_token[start_num])])
        novel_part = novel_part[0:b] + "<a id = 'part"+str(i)+"' class='sentence' val='"+str(start_num)+"'>"+novel_part[b:e]+"</a>"+novel_part[e:]

    print(novel_part)

    data={
        "novel_part" : novel_part,
        "novel_name" : novel.Novel_title,
    }
    return JsonResponse(data)

def save(request):
    text_name=request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title=text_name)
    novel.Novel_Text = request.GET.get("text")
    print(request.GET.get("text"))
    print(novel.Novel_Text)
    novel.save()
    data={

    }
    return JsonResponse(data)

def return_data(request):
    r_d = json.loads(request.GET.get("summary"))
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    print(r_d)
    for d in r_d:
        summary = Meta_Novel_Sequence(Novel = novel, start_sen_num = d['start'], end_sen_num = d['end'], summary = d['summary'], is_beginning = d['beginning'])
        summary.save()
    data={

    }
    return JsonResponse(data)

def retrieve_important_event(request):
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    trivial_blocks = Time_Block.objects.filter(Novel = novel, Important_Seq__lt = 0)
    if novel.Novel_num_of_trivial_time_blocks is 0 :
        novel.Novel_num_of_trivial_time_blocks = trivial_blocks.count()
        novel.save()
    subject_texts = trivial_blocks.filter(Important_Seq_group_num__lt=0).annotate(vote_num = Count('work_result_putter')).order_by('vote_num')

    min_count = subject_texts.filter(vote_num = subject_texts.aggregate(Min('vote_num'))['vote_num__min']).count()
    #print("min num", min_count)
    rand_id = random.randrange(0, min_count)
    print(subject_texts)
    print(rand_id)
    subject_text = subject_texts[rand_id]
    print(subject_text._id)
    #subject_texts = subject_texts.values('_id').annotate(Max('time_block_position_vote__vote'))
    #print(subject_texts)
    sub_dic={
        'summary': subject_text.Time_Block_Summary,
        'full_text' : subject_text.Time_Block_Full_Text,
        'id': subject_text._id
    }
    dicts = extract_important_blocks(novel)
    data={
        'subject_block' : json.dumps(sub_dic),
        "novel_name" : novel.Novel_title,
        'important_blocks':json.dumps(dicts),
        'total_time_block_num' : Time_Block.objects.filter(Novel=novel).count(),
    }
    return JsonResponse(data)

def putter_return_data(request):
    #putter_work_info(request.GET.get("worker_id"), request.GET.get("work_description"))
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    subject_text = Time_Block.objects.get(Novel = novel, _id = request.GET.get("full_text"))
    imp_group_num = request.GET.get("important_seq_num")
    wrp = Work_Result_Putter(worker_id = request.GET.get("worker_id"), subject_time_block = subject_text, important_blocks_position = imp_group_num)
    if imp_group_num is not -1:
        wrp.certainty_score = 1
    wrp.save()
    #vote_group = Time_Block_Position_Vote.objects.filter(time_block = subject_text, Important_Seq_group_num = imp_group_num)

    data={

    }
    return JsonResponse(data)

def flag_comparison_return_data(request):
    worker_id = request.GET.get("worker_id")
    prev_id = int(request.GET.get("prev_id"))
    print(prev_id)
    print(type(prev_id))
    next_id = int(request.GET.get("next_id"))
    imp_id = int(request.GET.get("imp_id"))
    comp_id = int(request.GET.get("comp_id"))
    comp_result = int(request.GET.get("comp_result"))
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    first_block = request.GET.get("first_block")
    time_block_pairwise_comparison = Time_Block_Pairwise_Comparison.objects.get(Novel = novel, Important_Seq_group_num= imp_id, _id = comp_id)
    time_block_pairwise_comparison.vote_number = time_block_pairwise_comparison.vote_number + 1
    if comp_result is -1:
        prev_block = Time_Block.objects.get(Novel = novel, _id = prev_id)
        next_block = Time_Block.objects.get(Novel = novel, _id = next_id)
        work_result_flag = Work_Result_Flag(worker_id = worker_id, _prev = prev_block, _next = next_block, important_blocks_position = imp_id, certainty_score = -1)
    else:
        prev_block = Time_Block.objects.get(Novel = novel, _id = prev_id)
        next_block = Time_Block.objects.get(Novel = novel, _id = next_id)
        work_result_flag = Work_Result_Flag(worker_id = worker_id, _prev = prev_block, _next = next_block, important_blocks_position = imp_id, certainty_score = 1)
    work_result_flag.save()
    time_block_pairwise_comparison.save()
    data={

    }
    return JsonResponse(data)

def brute_comparison_return_data(request):
    brute_work_info(request.GET.get("worker_id"), request.GET.get("work_description"))
    comp_id = request.GET.get("comp_id")
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    first_block = request.GET.get("first_block")
    print(first_block)
    print(text_name)
    f_b = Time_Block.objects.filter(_id = first_block, Novel = novel)
    print("returning...")
    print(f_b)
    if f_b.count() is 0:
        print("hey?")
        comp_sets = Brute_Time_Block_Pairwise_Comparison.objects.filter(_id = comp_id, Novel=novel)
        for comp_set in comp_sets:
            print("hoho")
            comp_set.not_sure = comp_set.not_sure + 1
            comp_set.save()
    else:
        TBC = Brute_Time_Block_Pairwise_Comparison.objects.get(_id = comp_id, Novel = novel, _prev = f_b[0])
        TBC.vote=TBC.vote+1
        TBC.save()
        print("horay!")
    data={

    }
    return JsonResponse(data)
def generate_trivial_event_position(novel):
    trivial_time_blocks = Time_Block.objects.filter(Novel = novel, Important_Seq_group_num__lt =0)
    #get possible combinations
    block_group = {}
    for trivial_time_block in trivial_time_blocks:
        print(trivial_time_block)
        trivial_time_result = trivial_time_block.work_result_putter.values('important_blocks_position').annotate(vote_count=Count('important_blocks_position'))
        max_vote_count = trivial_time_result.aggregate(max_vote_count = Max('vote_count'))['max_vote_count']
        #trivial_time_block = trivial_time_block.filter(vote_count = Max('vote_count'))
        position = trivial_time_result.filter(vote_count = max_vote_count)[0]['important_blocks_position']
        if str(position) not in block_group:
            block_group[str(position)] = []
        block_group[str(position)].append(trivial_time_block)
    print(block_group)
    for group in block_group:
        block_list = block_group[group]
        _id = 0
        for i in range(0, len(block_list)):
            for j in range(i+1, len(block_list)):
                print(i)
                tbpc = Time_Block_Pairwise_Comparison(Novel = novel, block_a = block_list[i], block_b = block_list[j], Important_Seq_group_num = int(group), _id = _id)
                tbpc.save()
                _id = _id+1


def retrieve_important_event_in_same_group(request):

    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)

    align_flag_events(novel)

    dicts = extract_important_blocks(novel)
    if Time_Block_Pairwise_Comparison.objects.filter(Novel = novel).count() is 0:
        generate_trivial_event_position(novel)
    #get least votes # of those combinations
    #Time_Block_Pairwise_Comparison.annotate(vote_sum = Sum('block_a_first', 'block_b_first', ''))
    #get blocks of that comb
    #get least votes # of those combinations
    comparison_sets = Time_Block_Pairwise_Comparison.objects.filter(Novel = novel).filter(vote_number__lt=5).order_by('vote_number')
    if comparison_sets.count() is 0:
        comparison_sets = Time_Block_Pairwise_Comparison.objects.filter(Novel = novel)
    min_count = comparison_sets.aggregate(Min('vote_number'))['vote_number__min']
    rand_id = random.randrange(0, comparison_sets.count())#comparison_sets.filter(vote_number = min_count).count())
    comparison_set = comparison_sets[rand_id]
    print(comparison_sets)
    print(comparison_sets.filter(vote_number = min_count).count())
    print(rand_id)
    print(comparison_set)
    dict1={
        'summary' : comparison_set.block_a.Time_Block_Summary,
        'full_text' : comparison_set.block_a.Time_Block_Full_Text,
        'id' : comparison_set.block_a._id
    }
    dict2={
        'summary' : comparison_set.block_b.Time_Block_Summary,
        'full_text' : comparison_set.block_b.Time_Block_Full_Text,
        'id' : comparison_set.block_b._id
    }
    data={
        'total_time_block_num' : Time_Block.objects.filter(Novel = novel).count(),
        "novel_name" : novel.Novel_title,
        'important_blocks': json.dumps(dicts),
        'text_a' : json.dumps(dict1),
        'text_b' : json.dumps(dict2),
        'imp_id' : comparison_set.Important_Seq_group_num,
        'comp_id' : comparison_set._id,
    }
    return JsonResponse(data)

def retrieve_event_in_same_group_brute(request):
    align_brute_events()
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    comparison_sets = Brute_Time_Block_Pairwise_Comparison.objects.filter(Novel = novel)
    if comparison_sets.count() is 0:
        blocks = Time_Block.objects.filter(Novel = novel)
        id_= 0
        for i in range(0, blocks.count()):
            for j in range(i+1, blocks.count()):
                block_a = blocks[i]
                block_b = blocks[j]
                t_a = Brute_Time_Block_Pairwise_Comparison(Novel = novel,_id = id_, _prev = block_a, _next = block_b)
                t_b = Brute_Time_Block_Pairwise_Comparison(Novel = novel,_id = id_, _prev = block_b, _next = block_a)
                t_a.save()
                t_b.save()
                id_ = id_ + 1
        comparison_sets = Brute_Time_Block_Pairwise_Comparison.objects.filter(Novel = novel)
    print("currently.. done is.........")
    print(comparison_sets.values('_id').annotate(id_vote = Sum('vote')+Max('not_sure')).order_by('id_vote').aggregate(Sum('id_vote'))['id_vote__sum']- 15)
    comparison_sets = comparison_sets.values('_id').annotate(id_vote = Sum('vote')+Max('not_sure')).filter(id_vote__lt= 3).order_by('id_vote')
    print(comparison_sets)
    print(comparison_sets.count())
    print(comparison_sets.aggregate(Sum('id_vote')))
    rand_id = random.randrange(0,comparison_sets.count())
    if comparison_sets[rand_id]['id_vote'] < 3:
        comparison_set_id=comparison_sets[rand_id]['_id']
        print(comparison_sets[rand_id])
    print(comparison_set_id)
    comparison_set = Brute_Time_Block_Pairwise_Comparison.objects.filter(Novel=novel, _id = comparison_set_id)[0]
    print(comparison_set)
    dict1={
        'summary' : comparison_set._prev.Time_Block_Summary,
        'full_text' : comparison_set._prev.Time_Block_Full_Text,
        'id' : comparison_set._prev._id
    }
    dict2={
        'summary' : comparison_set._next.Time_Block_Summary,
        'full_text' : comparison_set._next.Time_Block_Full_Text,
        'id' : comparison_set._next._id
    }
    data={
        'summary' : novel.Summary,
        "novel_name" : novel.Novel_title,
        'text_a' : json.dumps(dict1),
        'text_b' : json.dumps(dict2),
        'comp_id' : comparison_set_id,
    }
    return JsonResponse(data)

def brute_work_info(worker_id, work_description):
    WI = Work_Result_Brute(worker_id = worker_id, work_description = work_description)
    WI.save()
def putter_work_info(worker_id, work_description):
    WI = UnDef_Work_Result_Putter(worker_id = worker_id, work_description = work_description)
    WI.save()


def flag_work_info(worker_id, work_description):
    WI = Work_Result_Flag(worker_id = worker_id, work_description = work_description)
    WI.save()

def extract_important_blocks(novel):
    important_blocks = Time_Block.objects.filter(Novel = novel, Important_Seq__gte = 0).order_by("Important_Seq")
    dicts = []
    for important_block in important_blocks:
        dic = {}
        dic['summary'] = important_block.Time_Block_Summary
        dic['full_text'] = important_block.Time_Block_Full_Text
        dic['important_seq'] = important_block.Important_Seq
        dic['id'] = important_block._id
        dicts.append(dic)

    return dicts

def align_brute_events():
    t = Brute_Time_Block_Pairwise_Comparison.objects.values('_prev___id').annotate(Sum('vote'))
    tt = Brute_Time_Block_Pairwise_Comparison.objects.values('_next___id').annotate(tot =Sum('vote')+Sum('not_sure'))
    print(t)
    print(tt)
    ratio=[]
    for i in range(0, 10):
        ratio.append(t[i]['vote__sum']/(t[i]['vote__sum']+tt[i]['tot']))
    print(ratio)
    print("--------------")

def align_flag_events(novel):
    t = Work_Result_Flag.objects.values('important_blocks_position').values('_prev___id', '_next___id').annotate(Count('_prev'))
    tt = Work_Result_Flag.objects.values('important_blocks_position').values('_next___id').annotate(Count('_next'))
    ratio={}
    for i in range(0,len(t)):
        t[i]['diff'] = t[i]['_prev__count'] - t.get(_prev___id = t[i]['_next___id'],_next___id = t[i]['_prev___id'])['_prev__count']
        t[i]['prev_ratio'] = t[i]['_prev__count']/(t[i]['_prev__count']+t.get(_prev___id = t[i]['_next___id'],_next___id = t[i]['_prev___id'])['_prev__count'])
        if t[i]['_prev___id'] not in ratio:
            ratio[t[i]['_prev___id']] = {
            'val' : 0,
            'count' : 0,
            }
        ratio[t[i]['_prev___id']]['val'] = ratio[t[i]['_prev___id']]['val'] + t[i]['prev_ratio']
        ratio[t[i]['_prev___id']]['count'] = ratio[t[i]['_prev___id']]['count']+1
    print(t)
    for i in ratio.keys():
        ratio[i]['val'] = ratio[i]['val']/ratio[i]['count']
    print(ratio)

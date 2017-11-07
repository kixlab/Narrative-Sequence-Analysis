from django.shortcuts import render
import json
import math
from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.db.models import Sum, Max
from .models import Novel, Meta_Novel_Sequence, Time_Block, Time_Block_Position_Vote, Time_Block_Pairwise_Comparison, Brute_Time_Block_Pairwise_Comparison
from nltk.tokenize import sent_tokenize
from nltk.tokenize.punkt import PunktSentenceTokenizer
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
    subject_text = trivial_blocks.filter(Important_Seq_group_num__lt=0).annotate(vote_num = Sum('time_block_position_vote__vote')).order_by('vote_num')[0]
    print(subject_text.vote_num)
    sub_dic={
        'summary': subject_text.Time_Block_Summary,
        'full_text' : subject_text.Time_Block_Full_Text,
    }
    dicts = extract_important_blocks(novel)
    data={
        'subject_block' : json.dumps(sub_dic),
        "novel_name" : novel.Novel_title,
        'important_blocks':json.dumps(dicts)
    }
    return JsonResponse(data)

def putter_return_data(request):
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    subject_text = Time_Block.objects.get(Novel = novel, Time_Block_Full_Text = request.GET.get("full_text"))
    imp_group_num = request.GET.get("important_seq_num")
    vote_group = Time_Block_Position_Vote.objects.filter(time_block = subject_text, Important_Seq_group_num = imp_group_num)
    if vote_group.count() is 0:
        vote_info = Time_Block_Position_Vote(time_block = subject_text, Important_Seq_group_num = imp_group_num, vote=1)
    else:
        vote_info = vote_group[0]
        vote_info.vote = vote_info.vote + 1
    vote_info.save()
    vote_tb_group = Time_Block_Position_Vote.objects.filter(time_block = subject_text)
    vote_sum = vote_tb_group.aggregate(Sum('vote'))['vote__sum']
    if vote_sum >= 3 :
        the_object = Time_Block_Position_Vote.objects.filter(time_block = subject_text).order_by('-vote')[0]
        subject_text.Important_Seq_group_num = the_object.Important_Seq_group_num
        subject_text.save()
        if Time_Block.objects.filter(Novel = novel).count() is Time_Block.objects.filter(Novel = novel, Important_Seq_group_num__gte = 0).count():
            print("max!")
            novel_texts = Time_Block.objects.filter(Novel = novel)
            max_imp_num = novel_texts.aggregate(Max('Important_Seq_group_num'))['Important_Seq_group_num__max']
            for imp_num in range(0, max_imp_num+1):
                one_non_imp_group = novel_texts.filter(Important_Seq_group_num = imp_num, Important_Seq = -1)
                print(one_non_imp_group)
                id_= 0
                for i in range(0, one_non_imp_group.count()):
                    for j in range(i+1, one_non_imp_group.count()):
                        block_a = one_non_imp_group[i]
                        block_b = one_non_imp_group[j]
                        print(i)
                        print(j)
                        print(block_a)
                        print(block_b)
                        t_a = Time_Block_Pairwise_Comparison(Novel = novel,_id = id_, _prev = block_a, _next = block_b, Important_Seq_group_num = imp_num)
                        t_b = Time_Block_Pairwise_Comparison(Novel = novel,_id = id_, _prev = block_b, _next = block_a, Important_Seq_group_num = imp_num)
                        t_a.save()
                        t_b.save()
                        id_ = id_ + 1

    data={

    }
    return JsonResponse(data)

def flag_comparison_return_data(request):
    imp_id = request.GET.get("imp_id")
    comp_id = request.GET.get("comp_id")
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    first_block = request.GET.get("first_block")
    f_b = Time_Block.objects.filter(Time_Block_Full_Text = first_block, Novel = novel)
    if f_b.count() is 0:
        comp_sets = Time_Block_Pairwise_Comparison.objects.filter(Important_Seq_group_num = imp_id, _id = comp_id, Novel=novel)
        for comp_set in comp_sets:
            comp_set.not_sure = comp_set.not_sure + 1
            comp_set.save()
    else:
        TBC = Time_Block_Pairwise_Comparison.objects.get(Important_Seq_group_num = imp_id, _id = comp_id, Novel = novel, _prev = f_b)
        TBC.vote=TBC.vote+1
        TBC.save()
        print("horay!")
    data={

    }
    return JsonResponse(data)

def brute_comparison_return_data(request):
    comp_id = request.GET.get("comp_id")
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    first_block = request.GET.get("first_block")
    f_b = Time_Block.objects.filter(Time_Block_Full_Text = first_block, Novel = novel)
    if f_b.count() is 0:
        comp_sets = Brute_Time_Block_Pairwise_Comparison.objects.filter(_id = comp_id, Novel=novel)
        for comp_set in comp_sets:
            comp_set.not_sure = comp_set.not_sure + 1
            comp_set.save()
    else:
        TBC = Brute_Time_Block_Pairwise_Comparison.objects.get(_id = comp_id, Novel = novel, _prev = f_b)
        TBC.vote=TBC.vote+1
        TBC.save()
        print("horay!")
    data={

    }
    return JsonResponse(data)

def retrieve_important_event_in_same_group(request):
    text_name = request.GET.get("text_name")
    novel = Novel.objects.get(Novel_title = text_name)
    dicts = extract_important_blocks(novel)
    comparison_sets = Time_Block_Pairwise_Comparison.objects.filter(Novel = novel)
    comparison_sets = comparison_sets.values('Important_Seq_group_num', '_id').annotate(id_vote = Sum('vote')+Max('not_sure')).order_by('id_vote')
    print(comparison_sets)
    if comparison_sets[0]['id_vote'] < 3:
        comparison_set_id=comparison_sets[0]['_id']
    imp_id = comparison_sets[0]['Important_Seq_group_num']
    print(comparison_set_id)
    comparison_set = Time_Block_Pairwise_Comparison.objects.filter(Novel=novel, _id = comparison_set_id, Important_Seq_group_num=imp_id)[0]
    print(comparison_set)
    dict1={
        'summary' : comparison_set._prev.Time_Block_Summary,
        'full_text' : comparison_set._prev.Time_Block_Full_Text,
    }
    dict2={
        'summary' : comparison_set._next.Time_Block_Summary,
        'full_text' : comparison_set._next.Time_Block_Full_Text,
    }
    data={
        "novel_name" : novel.Novel_title,
        'important_blocks': json.dumps(dicts),
        'text_a' : json.dumps(dict1),
        'text_b' : json.dumps(dict2),
        'imp_id' : comparison_set.Important_Seq_group_num,
        'comp_id' : comparison_set_id,
    }
    return JsonResponse(data)

def retrieve_event_in_same_group_brute(request):
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

    comparison_sets = comparison_sets.values('_id').annotate(id_vote = Sum('vote')+Max('not_sure')).order_by('id_vote')
    print(comparison_sets)
    if comparison_sets[0]['id_vote'] < 3:
        comparison_set_id=comparison_sets[0]['_id']
    print(comparison_set_id)
    comparison_set = Brute_Time_Block_Pairwise_Comparison.objects.filter(Novel=novel, _id = comparison_set_id)[0]
    print(comparison_set)
    dict1={
        'summary' : comparison_set._prev.Time_Block_Summary,
        'full_text' : comparison_set._prev.Time_Block_Full_Text,
    }
    dict2={
        'summary' : comparison_set._next.Time_Block_Summary,
        'full_text' : comparison_set._next.Time_Block_Full_Text,
    }
    data={
        'summary' : novel.Summary,
        "novel_name" : novel.Novel_title,
        'text_a' : json.dumps(dict1),
        'text_b' : json.dumps(dict2),
        'comp_id' : comparison_set_id,
    }
    return JsonResponse(data)


def extract_important_blocks(novel):
    important_blocks = Time_Block.objects.filter(Novel = novel, Important_Seq__gte = 0).order_by("Important_Seq")
    dicts = []
    for important_block in important_blocks:
        dic = {}
        dic['summary'] = important_block.Time_Block_Summary
        dic['full_text'] = important_block.Time_Block_Full_Text
        dic['important_seq'] = important_block.Important_Seq
        dicts.append(dic)

    return dicts

def genarrows(reqdata):     # возвращается варианты переходов из панорамы в порядке sort_order
    with open(f'static/img/{reqdata}/info.txt') as f:
            lis = ''.join(f.readlines()).split()
            dirs_dict = {f'p{i[:-1]}': i[-1] for i in lis}
            sort_order = ['l', 'f', 'r', 'b']   # l - left, f - forward, etc

            res = sorted(dirs_dict, key=lambda x: sort_order.index(dirs_dict[x]))

            # new_dict = {f'{i}': dirs_dict[i] for i in res}
            # print(dirs_dict, new_dict)

            return (dirs_dict, res)
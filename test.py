import os

dict = {
    "p0": "1 2",
    "p1": "0 4 13",
    "p2": "3 19",
    "p3": "2 4",
    "p4": "0 1 3",
    "p5": "6 13",
    "p6": "5 7",
    "p7": "6 8",
    "p8": "7 9",
    "p9": "8 10",
    "p10": "9 11",
    "p11": "10 14",
    "p12": "14 16",
    "p13": "1 5",
    "p14": "11 12 16",
    "p15": "16 19",
    "p16": "14 15 12",
    "p17": "19 18",
    "p18": "17",
    "p19": "17 2"
}

for i in range(20):
    # os.remove(f'static/img/p{i}/info.txt')
    with open(f'static/img/p{i}/info.txt', 'w') as f:
        f.write(dict[f'p{i}'])
import json
from collections import defaultdict
business_loc_data = defaultdict(str)
count_city = defaultdict(int)

def splitfile(infilepath, outfilepath1, chunksize):
    with open(infilepath,'r',encoding='utf-8') as f:
        for line in (f.readline() for _ in range(150347)):
            if line:
                jsonline = json.loads(line)
                business_loc_data[jsonline['business_id']] = jsonline['city']
                #count_city[jsonline['city']] += 1
    '''
    cities = sorted(count_city, key=count_city.get, reverse=True)[:15]
    for c in cities:
        print(c + " : " + str(count_city[c]))
    return
    '''
    print(len(business_loc_data))
    fname, ext = outfilepath1.rsplit('.',1)
    i = 0
    written = False
    with open(outfilepath1,'r',encoding='utf-8') as outfilepath2:
        while True:
            outfilepath = "{}{}.{}".format(fname, i, ext)
            with open(outfilepath, 'w', encoding = 'utf-8') as outfile:
                lineCount = 0
                for line in (outfilepath2.readline() for _ in range(chunksize)):
                    jsonline = json.loads(line)
                    jsonline['city'] = business_loc_data[jsonline['business_id']]
                    line = json.dumps(jsonline)
                    line = line + "\n"
                    if lineCount == 0 and line:
                        outfile.write("["+line[:-1]+","+line[-1])
                    elif lineCount == chunksize - 1 and line:
                        outfile.write(line[:-1]+"]"+line[-1])
                    else:
                        if line:
                            outfile.write(line[:-1]+","+line[-1])
                    lineCount += 1
                written = bool(line)
            if not written:
                break
            i += 1

splitfile("PATH1", "PATH2", 100)
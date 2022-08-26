from codecs import ignore_errors
from tarfile import ENCODING


def splitfile(infilepath, chunksize):
    fname, ext = infilepath.rsplit('.',1)
    i = 0
    written = False
    with open(infilepath,'r',encoding='utf-8') as infile:
        while True:
            outfilepath = "{}{}.{}".format(fname, i, ext)
            with open(outfilepath, 'w', encoding = 'utf-8') as outfile:
                lineCount = 0
                for line in (infile.readline() for _ in range(chunksize)):
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
splitfile("PATH", 100)
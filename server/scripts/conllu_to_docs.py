from io import open
from conllu import parse_tree_incr
import os

path_to_udfile = "/Users/stephen/IdeaProjects/UD_English-EWT/en_ewt-ud-train.conllu"

outpath = "data/en_ewt-ud-train"
if not os.path.exists(outpath):
    os.mkdir(outpath)

outfile = None

numdocs = 0

with open(path_to_udfile, "r", encoding="utf-8") as data_file:

    for sentence in parse_tree_incr(data_file):
        md = sentence.metadata
        if "newdoc id" in md:
            # close the last one
            if outfile is not None:
                outfile.close()

            # open a new one
            docid = md["newdoc id"]
            outfile = open(os.path.join(outpath, docid), 'w')
            numdocs += 1

        # write the current sentence
        outfile.write(sentence.serialize())

print(f"Wrote out {numdocs} docs")

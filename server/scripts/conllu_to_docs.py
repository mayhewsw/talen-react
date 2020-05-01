from io import open
from conllu import parse_tree_incr
import os
import sys

if len(sys.argv) != 3:
    print("Usage: python conllu_to_docs.py UD-conllu-file.conllu output_folder/")

path_to_udfile = sys.argv[1]

outpath = sys.argv[2]
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

print(f"Wrote out {numdocs} docs to {outpath}")

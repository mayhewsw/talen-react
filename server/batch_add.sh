# PUD: 
# TODO: Galician
# bn, magahi don't actually have PUD datasets
# ar has problems
# we already have: en, hi, sv, pt, de, ru, zh, id, es, ko, ja, tr, fr, cs, it, th, is, fi
DIR=UD_Bavarian-Maibaam
DNAME=bar_maibaam-ud

ENV=prod

# git clone https://github.com/UniversalDependencies/${DIR}

# python -m scripts.conllu_to_mongo --input-file ${DIR}/${DNAME}-train.conllu --dataset-name ${DNAME}-train --environment ${ENV}
# python -m scripts.conllu_to_mongo --input-file ${DIR}/${DNAME}-dev.conllu --dataset-name ${DNAME}-dev --environment ${ENV}
python -m scripts.conllu_to_mongo --input-file ${DIR}/${DNAME}-test.conllu --dataset-name ${DNAME}-test --environment ${ENV}

# For Russian SynTagRus
# python -m scripts.conllu_to_mongo --input-file ${DIR}/${DNAME}-train-a.conllu --dataset-name ${DNAME}-train-a --environment ${ENV} --ignore-docs
# python -m scripts.conllu_to_mongo --input-file ${DIR}/${DNAME}-train-b.conllu --dataset-name ${DNAME}-train-b --environment ${ENV}
# python -m scripts.conllu_to_mongo --input-file ${DIR}/${DNAME}-train-c.conllu --dataset-name ${DNAME}-train-c --environment ${ENV}


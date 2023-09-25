from talen.config import Config
from talen.dal.mongo_dal import MongoDAL

def mongo_test():

    config = Config("prod")

    mongo_dal = MongoDAL(config.mongo_url)
    print(mongo_dal)
    print(mongo_dal.url)

    s = mongo_dal.get_stats()
    print(s)

    # datasets = mongo_dal.datasets
    # annotations = mongo_dal.annotations

    # res = datasets.aggregate( [
    #     {
    #         '$group': {
    #             '_id': '$dataset_id', 
    #             'num_docs': {
    #                 '$count': {}
    #             }
    #         }
    #     }
    # ] )

    # print(res)
    # for r in res:
    #     print(r)

    # res = annotations.aggregate( [
    #     {
    #             '$group': {
    #                 '_id': '$dataset_id', 
    #                 'unique_annotated_docs': {
    #                     '$addToSet': '$doc_id'
    #                 }, 
    #                 'unique_annotators': {
    #                     '$addToSet': '$user_id'
    #                 }
    #             }
    #         }, {
    #             '$project': {
    #                 'num_annotated_docs': {
    #                     '$size': '$unique_annotated_docs'
    #                 }, 
    #                 'num_unique_annotators': {
    #                     '$size': '$unique_annotators'
    #                 }
    #             }
    #         }
    # ] )

    # print(res)
    # for r in res:
    #     print(r)

    # annotations.distinct("doc_id", {"dataset_id": dataset_id, "user_id": user_id})

    
if __name__ == "__main__":
    mongo_test()
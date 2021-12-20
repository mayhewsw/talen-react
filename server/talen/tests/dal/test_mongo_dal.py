
def test_add_get_document(mongo_dal, document):
    mongo_dal.add_document(document)
    returned_doc = mongo_dal.get_document(document.id, document.dataset_id)
    assert document == returned_doc

def test_add_get_document_multiple(mongo_dal, document_list):
    dataset_id = document_list[0].dataset_id

    for doc in document_list:
        mongo_dal.add_document(doc)

    returned_docs = mongo_dal.get_document_list(dataset_id)
    assert returned_docs[0] == document_list[0]
    assert len(returned_docs) == len(document_list)

def test_get_datasets(mongo_dal, document_list):
    expected_dataset_list = ["ds1", "ds2", "ds3"]

    # this is a little hacky b/c we are modifying the document list
    # just make sure not to use it below!
    for dataset_id in expected_dataset_list:
        for doc in document_list:
            doc.dataset_id = dataset_id
            mongo_dal.add_document(doc)

    assert set(mongo_dal.get_dataset_list()) == set(expected_dataset_list)

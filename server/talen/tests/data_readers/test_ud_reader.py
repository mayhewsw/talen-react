
from talen.data_readers.ud_reader import UDReader
from talen.models.document import Document

def test_ud_reader(conllu_path):
    docs = UDReader.read_docs(conllu_path, "test")
    assert len(docs) == 2
    assert len(docs[0].sentences) == 5
    assert len(docs[1].sentences) == 2

    sent = docs[1].sentences[0]
    expected_text = "The sheikh in wheel-chair has been attacked with a F-16-launched bomb."
    text = Document.get_sentence_text(sent)
    assert text == expected_text
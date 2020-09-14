def getPhrases(sent, labels):
    phrases = []
    i = 0
    phrase = None
    start = -1
    label = None
    for tok, tok_label in zip(sent, labels):
        if tok_label == "O":
            if phrase is not None:
                phrases.append((" ".join(phrase), start, label))
            phrase = None
            start = -1
            label = None
        elif tok_label[0] == "B":
            phrase = [tok]
            start = i
            label = tok_label.split("-")[-1]
        elif tok_label[0] == "I":
            # assume the data is well-formed.... ugh
            phrase.append(tok)
        i += 1

    if phrase is not None:
        phrases.append((" ".join(phrase), start, label))

    return phrases

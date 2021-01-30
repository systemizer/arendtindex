import json


def process_file():
    sentences = []
    full_text = ""

    page_number = 1
    chapter = "Introduction"
    section = ""
    bufsentence = ""
    
    for line in open("./data/human-condition.txt", "r"):
        line = line.strip().rstrip()
        if not line:
            continue

        if line.startswith("[[["):
            section = line.replace("[", "").replace("]", "")
            continue
        if line.startswith("[["):
            chapter = line.replace("[", "").replace("]", "")
            continue
        if line.startswith("["):
            page_number += 1
            continue

        split = line.split(".")
        if len(split) == 1:
            bufsentence += " " + split[0]
            continue
        else:
            for l in line.split(".")[:-1]:
                sentences.append({
                    "text": bufsentence + " " + l + ".",
                    "chapter": chapter,
                    "section": section,
                    "pageNumber": page_number
                })
                bufsentence = ""
            bufsentence = line.split(".")[-1]

    for s in sentences:
        s["text"] = s["text"].replace("- ", "").strip()

    # For JSON
    with open("./build/human-condition.json", "w") as f:
        json.dump(sentences, f)

if __name__ == "__main__":
    process_file()
    

import json


def process_file():
    pages = []
    current_page = ""
    page_num = 1
    for line in open("./data/human-condition.txt", "r"):
        line = line.strip().rstrip()
        if line.startswith("[") and line.endswith("]"):
            pages.append({
                'page': page_num,
                'text': current_page
            })
            current_page = ""
            page_num += 1
            continue

        if line == "The Human Condition":
            continue

        if not line:
            continue

        current_page += " " + line

    if current_page:
        pages.append({'page': page_num, 'text': current_page})

    with open("./build/human-condition.json", "w") as f:
        for p in pages:
            f.write(json.dumps({"index":{"_id":"%s" % p['page']}}) + "\n")
            f.write(json.dumps(p) + "\n")

if __name__ == "__main__":
    process_file()
    

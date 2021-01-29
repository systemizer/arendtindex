import json


def process_file():
    full_text = ""
    for line in open("./data/human-condition.txt", "r"):
        line = line.strip().rstrip()        
        if line.startswith("["):
            continue
        if line == "The Human Condition":
            continue
        if not line:
            continue

        full_text += " " + line

    full_text = full_text.replace("- ", "")


    sentences = ["%s." % s for s in full_text.split(".")]
    # For JSON
    with open("./build/human-condition.json", "w") as f:
        json.dump(sentences, f)

if __name__ == "__main__":
    process_file()
    

import os
import re


def get_folders(directory_path):
    folders = []

    try:
        items = os.listdir(directory_path)
        filtered = [item for item in items if item[0].isdigit()]

        for item in filtered:
            full_path = os.path.join(directory_path, item)
            if os.path.isdir(full_path):
                folders.append(item)

    except Exception as error:
        print("Error reading folders:", error)

    sorted_folders = sorted(folders, key=lambda folder: int(folder.split("-")[0]))
    return sorted_folders


def capitalize_link(folder_name):
    word = re.sub(r"[\d-]", " ", folder_name).strip()
    print({"word": word})
    return word[0].upper() + word[1:]


def update_readme():
    try:
        link = "https://victoriacheng15.github.io/three-js-demo/"
        current_directory = os.getcwd()
        folders = get_folders(current_directory)
        display_folder = "\n".join(
            [f"- [{capitalize_link(folder)}]({link}{folder})" for folder in folders]
        )
        markdown_content = f"# Three.js Demos\n\n{display_folder}"

        markdown_file_path = os.path.join(current_directory, "README.md")
        with open(markdown_file_path, "w") as file:
            file.write(markdown_content)
        print("README.md has been updated. ✌")
    except Exception as error:
        print("Error updating README.md:", error)


if __name__ == "__main__":
    update_readme()

import {
  Action,
  ActionPanel,
  Form,
  Icon,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import { useEffect, useState } from "react";
import {
  getCustomIgnoredFolders,
  setCustomIgnoredFolders,
} from "./utils/storage";
import { CustomIgnoredFolder } from "./interfaces/customignoredfolder";

/**
 * Custom Ignored Folders component for managing user-defined folders to ignore during scanning.
 * Allows users to add, remove, and filter custom ignored folders.
 */
export default function CustomIgnoredFolders() {
  const [ignoredFolders, setIgnoredFolders] = useState<CustomIgnoredFolder[]>(
    [],
  );
  useEffect(() => {
    getCustomIgnoredFolders().then(setIgnoredFolders);
  }, []);
  const [searchText, setSearchText] = useState("");
  const [showForm, setShowForm] = useState(false);

  /**
   * Handles the removal of a custom ignored folder from the list.
   * @param index - The index of the folder to remove.
   */
  function handleRemoveFolder(index: number) {
    const updated = ignoredFolders.filter((_, i) => i !== index);
    setIgnoredFolders(updated);
    setCustomIgnoredFolders(updated);
    showToast({
      style: Toast.Style.Success,
      title: "Ignored Folder Removed",
    });
  }

  /**
   * Handles the addition of a new custom ignored folder.
   * @param values - The form values containing folder name and optional description.
   */
  function handleAddFolder(values: {
    folderName: string;
    description: string;
  }) {
    const folderName = values.folderName.trim();
    const description = values.description.trim();

    if (!folderName) {
      showToast({
        style: Toast.Style.Failure,
        title: "Missing Folder Name",
        message: "Folder name is required.",
      });
      return;
    }

    const normalizedFolderName = folderName.toLowerCase();
    const filtered = ignoredFolders.filter(
      (f) => f.folderName.toLowerCase() !== normalizedFolderName,
    );

    const newFolder: CustomIgnoredFolder = {
      folderName: folderName,
      description: description || undefined,
    };

    const updated = [...filtered, newFolder];
    setIgnoredFolders(updated);
    setCustomIgnoredFolders(updated)
      .then(() => {
        showToast({
          style: Toast.Style.Success,
          title: "Ignored Folder Added",
          message: `${folderName} will be ignored during scanning`,
        });
        setShowForm(false);
      })
      .catch((e) => {
        showToast({
          style: Toast.Style.Failure,
          title: "Error Adding Ignored Folder",
          message: String(e),
        });
      });
  }

  const filteredFolders = ignoredFolders.filter(
    (f) =>
      f.folderName.toLowerCase().includes(searchText.toLowerCase()) ||
      (f.description &&
        f.description.toLowerCase().includes(searchText.toLowerCase())),
  );

  if (showForm) {
    return (
      <Form
        navigationTitle="Add Ignored Folder"
        actions={
          <ActionPanel>
            <Action.SubmitForm
              title="Add Ignored Folder"
              onSubmit={handleAddFolder}
            />
            <Action title="Cancel" onAction={() => setShowForm(false)} />
          </ActionPanel>
        }
      >
        <Form.TextField
          id="folderName"
          title="Folder Name"
          placeholder="e.g. node_modules, .cache, temp"
        />
        <Form.TextField
          id="description"
          title="Description (Optional)"
          placeholder="Brief description of why this folder should be ignored"
        />
      </Form>
    );
  }

  return (
    <List
      searchBarPlaceholder="Filter by folder name or description..."
      onSearchTextChange={setSearchText}
      throttle
      actions={
        <ActionPanel>
          <Action
            title="Add Ignored Folder"
            icon={Icon.Plus}
            onAction={() => setShowForm(true)}
          />
        </ActionPanel>
      }
    >
      <List.EmptyView
        title={
          searchText ? "No Ignored Folders Found" : "No Custom Ignored Folders"
        }
        description={
          searchText
            ? `No results for "${searchText}"`
            : "Add a custom folder to ignore during scanning."
        }
        icon={Icon.EyeDisabled}
      />
      {filteredFolders.map((folder, idx) => (
        <List.Item
          key={folder.folderName}
          title={folder.folderName}
          subtitle={folder.description}
          icon={Icon.EyeDisabled}
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                <Action
                  title="Remove Ignored Folder"
                  icon={Icon.Trash}
                  onAction={() => handleRemoveFolder(idx)}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

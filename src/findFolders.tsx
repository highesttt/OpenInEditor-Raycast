import {
  Action,
  ActionPanel,
  getPreferenceValues,
  Icon,
  List,
} from "@raycast/api";
import { useCachedPromise } from "@raycast/utils";
import { useState } from "react";
import { FileInfo } from "./interfaces/fileinfo";
import { Preferences } from "./interfaces/preferences";
import { folderCache, getCachedGitignoreFolders } from "./utils/ignore";
import { openFolderInEditor } from "./openInEditor";

export default function Command() {
  const prefs = getPreferenceValues<Preferences>();
  const { rootFolder, forceRefreshFolders } = prefs;
  const [searchText, setSearchText] = useState("");
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [cachedFolders, setCachedFolders] = useState<FileInfo[]>(
    folderCache?.folders || [],
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: folderResults,
    isLoading,
    revalidate,
  } = useCachedPromise(
    async (root: string, force: boolean) => {
      setIsRefreshing(true);
      const folders = await getCachedGitignoreFolders(root, force);
      setIsRefreshing(false);
      setCachedFolders(folders);
      return folders;
    },
    [rootFolder, !!forceRefreshFolders],
    { initialData: cachedFolders },
  );

  const displayFolders =
    isLoading && cachedFolders.length > 0 ? cachedFolders : folderResults || [];

  return (
    <List
      isLoading={isLoading && cachedFolders.length === 0}
      isShowingDetail={isShowingDetail}
      searchBarPlaceholder={
        isRefreshing ? "Refreshing folders..." : "Filter folders..."
      }
      onSearchTextChange={setSearchText}
      throttle
    >
      <List.EmptyView
        title={
          searchText
            ? "No Folders Found"
            : isRefreshing
              ? "Refreshing..."
              : "Scan for Gitignore Folders"
        }
        description={
          searchText
            ? `No results for "${searchText}"`
            : isRefreshing
              ? "Refreshing folder list."
              : "Scanning for folders containing .gitignore."
        }
        icon={Icon.Folder}
      />
      {displayFolders
        .filter((f) => f.name.toLowerCase().includes(searchText.toLowerCase()))
        .map((folder) => (
          <List.Item
            key={folder.commandline}
            id={folder.commandline}
            title={folder.name}
            subtitle={folder.commandline}
            icon={folder.icon}
            accessories={[{ text: folder.language || "Unknown" }]}
            actions={
              <ActionPanel>
                <ActionPanel.Section>
                  <Action
                    title="Open in Editor"
                    icon={Icon.Desktop}
                    onAction={() =>
                      openFolderInEditor(folder.commandline, folder.language)
                    }
                  />
                  <Action.CopyToClipboard
                    title="Copy Folder Path"
                    content={folder.commandline}
                  />
                  <Action
                    title="Toggle Details"
                    icon={Icon.AppWindowSidebarLeft}
                    onAction={() => setIsShowingDetail(!isShowingDetail)}
                    shortcut={{ modifiers: ["cmd"], key: "i" }}
                  />
                  <Action
                    title="Refresh Folders"
                    icon={Icon.Repeat}
                    onAction={() => revalidate()}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
    </List>
  );
}

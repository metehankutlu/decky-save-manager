import { ModalRoot, ServerAPI, showModal } from "decky-frontend-lib";
import { FilePickerProps } from "./components";
import FilePicker from "./components/FilePicker";

const values = (obj: any) => {
  return Object.values(Object(obj));
}

const openFilePicker = (
  startPath: string,
  includeFiles?: boolean,
  filter?: FilePickerProps['filter'],
  filePickerSettings?: {
    validFileExtensions?: string[];
    defaultHidden?: boolean;
  },
  serverApi?: ServerAPI
): Promise<{ path: string; realpath: string }> => {
  return new Promise((resolve, reject) => {
    if (!serverApi) return reject('No server API');
    const Content = ({ closeModal }: { closeModal?: () => void }) => (
      <ModalRoot
        onCancel={() => {
          reject('User canceled');
          closeModal?.();
        }}
      >
        <FilePicker
          serverApi={serverApi}
          startPath={startPath}
          includeFiles={includeFiles}
          filter={filter}
          onSubmit={resolve}
          closeModal={closeModal}
          {...filePickerSettings}
        />
      </ModalRoot>
    );
    showModal(<Content />);
  });
};

export { values, openFilePicker };
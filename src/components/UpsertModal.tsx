import {
    ButtonItem,
    ConfirmModal,
    ConfirmModalProps,
    Field, 
    Focusable, 
    PanelSection, 
    PanelSectionRow, 
    ServerAPI, 
    TextField
} from "decky-frontend-lib";
import { useState, VFC } from "react";
import { openFilePicker } from "../util";

const UpsertModal: VFC<ConfirmModalProps & {
    title: string,
    onConfirmClick: (text: string, filePath?: string) => void,
    filePicker?: string,
    serverAPI?: ServerAPI,
    textDefault?: string
}> = ({ title, onConfirmClick, filePicker, serverAPI, textDefault = '', ...props}) => {

    let [text, setText] = useState(textDefault);
    let [filePath, setFilePath] = useState(filePicker);

    let onClick = () => {
        if(filePicker)
            onConfirmClick(text, filePath);
        else
            onConfirmClick(text);
        props.closeModal?.();
    }
    return (
        <ConfirmModal
            onCancel={props.closeModal}
            onEscKeypress={props.closeModal}
            onOK={onClick} {...props}>
            <PanelSection title={title}>
                <PanelSectionRow>
                    <Field label="Name" description={
                        <Focusable>
                            <TextField 
                                focusOnMount={true} 
                                value={text} 
                                onChange={({target}) => {setText(target.value)}} 
                            />
                        </Focusable>
                    } />
                </PanelSectionRow>
                {
                    filePicker &&
                    <PanelSectionRow>
                        <ButtonItem 
                            label="Save file" 
                            description={
                                filePath != undefined && filePath != "/home/deck" ? 
                                filePath.length < 80 ? filePath : 
                                filePath.slice(0, 40) + '...' + filePath.slice(-40)
                                : ''}  
                            onClick={() => {
                                openFilePicker(filePicker, undefined, undefined, undefined, serverAPI).then(response => {
                                    setFilePath(response.realpath);
                                });
                        }}>
                            Select file
                        </ButtonItem>
                    </PanelSectionRow>
                }
            </PanelSection>
        </ConfirmModal>
    )
};

export { UpsertModal };
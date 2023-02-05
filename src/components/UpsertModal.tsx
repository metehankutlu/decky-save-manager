import {
    ConfirmModal,
    ConfirmModalProps,
    Field, 
    Focusable, 
    PanelSection, 
    PanelSectionRow, 
    TextField
} from "decky-frontend-lib";
import { useState, VFC } from "react";

const UpsertModal: VFC<ConfirmModalProps & {
    title: string,
    onConfirmClick: (text: string) => void,
    textDefault?: string
}> = ({ title, onConfirmClick, textDefault = '', ...props}) => {
    let [text, setText] = useState(textDefault);
    let onClick = () => {
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
            </PanelSection>
        </ConfirmModal>
    )
};

export { UpsertModal };
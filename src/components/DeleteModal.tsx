import {
    ConfirmModal,
    ConfirmModalProps,
    Focusable, 
    PanelSection, 
    PanelSectionRow
} from "decky-frontend-lib";
import { VFC } from "react";

const DeleteModal: VFC<ConfirmModalProps & {
    title: string,
    description: string,
    id: string
    onConfirmClick: (id: string) => void
}> = ({ title, description, id, onConfirmClick, ...props}) => {
    let onClick = () => {
        onConfirmClick(id);
        props.closeModal?.();
    }
    return (
        <ConfirmModal
            onCancel={props.closeModal}
            onEscKeypress={props.closeModal}
            onOK={onClick} {...props}>
            <PanelSection title={title}>
                <PanelSectionRow>
                    <Focusable>
                        { description }
                    </Focusable>
                </PanelSectionRow>
            </PanelSection>
        </ConfirmModal>
    )
};

export { DeleteModal };
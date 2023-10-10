import { Modal } from "antd"
import { FC } from "react"
import AvatarEditorCustom from "./AvatarEditorCustom"

interface AvatarChangeModalProps {
  isModalOpen: boolean,
  avatar: string
}
const AvatarChangeModal: FC<AvatarChangeModalProps> = ({ isModalOpen, avatar }) => {
  const handleOk = () => {

  }
  const handleCancel = () => {

  }
  return (
    <Modal
      width={800}
      title="Profile Photo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      <AvatarEditorCustom avatar={avatar} />
    </Modal>
  )
}

export default AvatarChangeModal

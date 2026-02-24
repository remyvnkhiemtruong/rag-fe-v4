import { adminLiteratureApi } from "../../services/api";
import InfoSectionManagement from "./InfoSectionManagement";

export default function LiteratureManagement({ onBack }) {
  return (
    <InfoSectionManagement
      api={adminLiteratureApi}
      sectionType="literature"
      titleKey="admin.literatureManagement"
      addKey="admin.addLiterature"
      confirmDeleteKey="admin.confirmDeleteInfo"
      onBack={onBack}
    />
  );
}

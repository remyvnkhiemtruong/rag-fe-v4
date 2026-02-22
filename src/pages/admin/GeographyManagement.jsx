import { geographyApi } from "../../services/api";
import InfoSectionManagement from "./InfoSectionManagement";

export default function GeographyManagement({ onBack }) {
  return (
    <InfoSectionManagement
      api={geographyApi}
      sectionType="geography"
      titleKey="admin.geographyManagement"
      addKey="admin.addGeography"
      confirmDeleteKey="admin.confirmDeleteInfo"
      onBack={onBack}
    />
  );
}

import { adminEconomicsApi } from "../../services/api";
import InfoSectionManagement from "./InfoSectionManagement";

export default function EconomicsManagement({ onBack }) {
  return (
    <InfoSectionManagement
      api={adminEconomicsApi}
      sectionType="economics"
      titleKey="admin.economicsManagement"
      addKey="admin.addEconomics"
      confirmDeleteKey="admin.confirmDeleteInfo"
      onBack={onBack}
    />
  );
}

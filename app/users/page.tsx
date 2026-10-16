import { PortalScreen } from "../../src/components/portal-screen";
import { UserManager } from "../../src/components/user-manager";

export default function UsersPage() { return <PortalScreen title="Usuarios y acceso" eyebrow="ADMINISTRACIÓN" description="Crea cuentas y controla los roles y el acceso de tu equipo."><UserManager/></PortalScreen>; }

import ComputerExplorerIcon from '@/assets/icons/computer_explorer-3.png';
import ConnDialupIcon from '@/assets/icons/conn_dialup.png';
import DesktopIcon from '@/assets/icons/desktop-1.png';
import DirectoryClosedIcon from '@/assets/icons/directory_closed-3.png';
import GithubIcon from '@/assets/icons/github.png';
import LinkedinIcon from '@/assets/icons/linkedin.png';
import MailboxWorldIcon from '@/assets/icons/mailbox_world-0.png';
import MsDosIcon from '@/assets/icons/ms_dos-1.png';
import MsInfo32Icon from '@/assets/icons/msinfo32-1.png';
import NetworkIcon from '@/assets/icons/network_internet_pcs_installer-3.png';
import RecycleBinFullIcon from '@/assets/icons/recycle_bin_full-3.png';
import SettingsGearIcon from '@/assets/icons/settings_gear-3.png';
import ShutDownIcon from '@/assets/icons/shut_down_normal-3.png';
import UserCardViewIcon from '@/assets/icons/user_card_view.png';
import WindowsIcon from '@/assets/icons/windows-4.png';

export const iconMap: Record<string, string> = {
  about: UserCardViewIcon,
  cv: MsInfo32Icon,
  projects: NetworkIcon,
  contact: ConnDialupIcon,
  terminal: MsDosIcon,
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: MailboxWorldIcon,
  folder: DirectoryClosedIcon,
  trash: RecycleBinFullIcon,
  settings: SettingsGearIcon,
  computer: ComputerExplorerIcon,
  shutdown: ShutDownIcon,
  desktop: DesktopIcon,
  windows: WindowsIcon,
};

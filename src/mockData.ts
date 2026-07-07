import { AppState } from "./types";

export const initialAppState: AppState = {
  currentUserState: {
    username: "NetMaster",
    mockRole: "Student",
    totalPoints: 82,
    globalRank: 6
  },
  problems: [
    {
      id: "prob_001",
      title: "Basic Router Interface Activation",
      topic: "IP Routing",
      difficulty: "Easy",
      author: "Instructor_Dan",
      format: "typing",
      instructions: "Enter global configuration mode, access interface GigabitEthernet0/0, assign IP address 192.168.1.1/24, and activate the line.",
      steps: [
        { "stepIndex": 0, "prompt": "Router>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Router#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Router(config)#", "expectedInput": "interface gigabitethernet0/0" },
        { "stepIndex": 3, "prompt": "Router(config-if)#", "expectedInput": "ip address 192.168.1.1 255.255.255.0" },
        { "stepIndex": 4, "prompt": "Router(config-if)#", "expectedInput": "no shutdown" }
      ]
    },
    {
      id: "prob_005",
      title: "Loopback Interface Creation",
      topic: "IP Routing",
      difficulty: "Easy",
      author: "NetCadet_99",
      format: "typing",
      instructions: "Create loopback interface 0, assign IP address 10.10.10.10/32, and set description 'MGMT-L0'.",
      steps: [
        { "stepIndex": 0, "prompt": "Router>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Router#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Router(config)#", "expectedInput": "interface loopback0" },
        { "stepIndex": 3, "prompt": "Router(config-if)#", "expectedInput": "ip address 10.10.10.10 255.255.255.255" },
        { "stepIndex": 4, "prompt": "Router(config-if)#", "expectedInput": "description MGMT-L0" }
      ]
    },
    {
      id: "prob_006",
      title: "Device Hostname and MOTD Banner",
      topic: "Device Security",
      difficulty: "Easy",
      author: "Instructor_Dan",
      format: "blanks",
      instructions: "Configure the hostname to 'CoreSwitch-A' and define a login banner message 'AUTHORIZED ONLY!'.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "hostname", "blankValue": "CoreSwitch-A", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "banner motd #", "blankValue": "AUTHORIZED ONLY!", "textAfter": "#" }
      ]
    },
    {
      id: "prob_002",
      title: "SSH Security Hardening Quiz",
      topic: "Device Security",
      difficulty: "Medium",
      author: "NetCadet_99",
      format: "blanks",
      instructions: "Fill in the missing command syntax blocks to establish secure cryptographic keys and local access control lines. Configure 'forge.net' as the domain name.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "ip domain-name", "blankValue": "forge.net", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "crypto", "blankValue": "key", "textAfter": "generate rsa modulus 2048" },
        { "lineIndex": 2, "textBefore": "line vty 0 4", "blankValue": "transport input", "textAfter": "ssh" }
      ]
    },
    {
      id: "prob_007",
      title: "Local User privilege & Secret",
      topic: "Device Security",
      difficulty: "Medium",
      author: "CiscoGuru_2026",
      format: "typing",
      instructions: "Create a local username 'admin' with privilege level 15 and password encryption secret 'P@ssw0rd99', then turn on service password encryption.",
      steps: [
        { "stepIndex": 0, "prompt": "Router>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Router#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Router(config)#", "expectedInput": "username admin privilege 15 secret P@ssw0rd99" },
        { "stepIndex": 3, "prompt": "Router(config)#", "expectedInput": "service password-encryption" }
      ]
    },
    {
      id: "prob_008",
      title: "Standard Access Control List (ACL)",
      topic: "Device Security",
      difficulty: "Medium",
      author: "NetworkDean",
      format: "blanks",
      instructions: "Establish standard IP access list 10 to permit host 192.168.1.50 and deny all other hosts, then bind it inbound on GigabitEthernet0/0.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "access-list 10 permit", "blankValue": "192.168.1.50", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "interface", "blankValue": "gigabitethernet0/0", "textAfter": "" },
        { "lineIndex": 2, "textBefore": "ip access-group 10", "blankValue": "in", "textAfter": "" }
      ]
    },
    {
      id: "prob_003",
      title: "VLAN Trunking & Access Configuration",
      topic: "VLANs & Trunking",
      difficulty: "Hard",
      author: "CiscoGuru_2026",
      format: "typing",
      instructions: "Configure interface GigabitEthernet0/1 on SwitchA to operate as an 802.1Q trunk line and set native VLAN to 99.",
      steps: [
        { "stepIndex": 0, "prompt": "Switch>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Switch#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Switch(config)#", "expectedInput": "interface gigabitethernet0/1" },
        { "stepIndex": 3, "prompt": "Switch(config-if)#", "expectedInput": "switchport mode trunk" },
        { "stepIndex": 4, "prompt": "Switch(config-if)#", "expectedInput": "switchport trunk native vlan 99" }
      ]
    },
    {
      id: "prob_004",
      title: "OSPF Area Border Configuration",
      topic: "IP Routing",
      difficulty: "Hard",
      author: "NetworkDean",
      format: "blanks",
      instructions: "Deploy OSPF process ID 10 with Router ID 1.1.1.1, and assign subnet 10.0.0.0/24 to Area 0.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "router ospf", "blankValue": "10", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "router-id", "blankValue": "1.1.1.1", "textAfter": "" },
        { "lineIndex": 2, "textBefore": "network 10.0.0.0", "blankValue": "0.0.0.255", "textAfter": "area 0" }
      ]
    },
    {
      id: "prob_009",
      title: "Router DHCP Server Pool",
      topic: "IP Routing",
      difficulty: "Hard",
      author: "CiscoGuru_2026",
      format: "typing",
      instructions: "Configure a DHCP IP exclusion from 192.168.10.1 to 192.168.10.10, setup a pool called 'LAN_POOL' for network 192.168.10.0/24 with default-router 192.168.10.1 and dns-server 8.8.8.8.",
      steps: [
        { "stepIndex": 0, "prompt": "Router>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Router#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Router(config)#", "expectedInput": "ip dhcp excluded-address 192.168.10.1 192.168.10.10" },
        { "stepIndex": 3, "prompt": "Router(config)#", "expectedInput": "ip dhcp pool LAN_POOL" },
        { "stepIndex": 4, "prompt": "Router(dhcp-config)#", "expectedInput": "network 192.168.10.0 255.255.255.0" },
        { "stepIndex": 5, "prompt": "Router(dhcp-config)#", "expectedInput": "default-router 192.168.10.1" },
        { "stepIndex": 6, "prompt": "Router(dhcp-config)#", "expectedInput": "dns-server 8.8.8.8" }
      ]
    },
    {
      id: "prob_010",
      title: "LACP EtherChannel Setup",
      topic: "VLANs & Trunking",
      difficulty: "Hard",
      author: "Instructor_Dan",
      format: "blanks",
      instructions: "Configure physical ports GigabitEthernet0/1 and GigabitEthernet0/2 into channel-group 1 active mode, then enter interface port-channel 1 to set its switchport mode to trunk.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "interface range", "blankValue": "gigabitethernet0/1 - 2", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "channel-group 1 mode", "blankValue": "active", "textAfter": "" },
        { "lineIndex": 2, "textBefore": "interface port-channel 1", "blankValue": "switchport mode trunk", "textAfter": "" }
      ]
    },
    {
      id: "prob_011",
      title: "Static Default Routing",
      topic: "IP Routing",
      difficulty: "Easy",
      author: "NetworkDean",
      format: "typing",
      instructions: "Configure a static default route directing all unspecified traffic to the next-hop gateway IP address 203.0.113.1.",
      steps: [
        { "stepIndex": 0, "prompt": "Router>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Router#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Router(config)#", "expectedInput": "ip route 0.0.0.0 0.0.0.0 203.0.113.1" }
      ]
    },
    {
      id: "prob_012",
      title: "VLAN Creation & Naming",
      topic: "VLANs & Trunking",
      difficulty: "Easy",
      author: "CiscoGuru_2026",
      format: "blanks",
      instructions: "Create local Virtual LAN (VLAN) ID 10 and assign it the administrative name 'SALES'.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "vlan", "blankValue": "10", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "name", "blankValue": "SALES", "textAfter": "" }
      ]
    },
    {
      id: "prob_013",
      title: "Inter-VLAN subinterface Routing",
      topic: "IP Routing",
      difficulty: "Medium",
      author: "Instructor_Dan",
      format: "typing",
      instructions: "Establish inter-vlan routing on subinterface GigabitEthernet0/0.10. Assign 802.1Q encapsulation for VLAN 10 and configure IP 192.168.10.1/24.",
      steps: [
        { "stepIndex": 0, "prompt": "Router>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Router#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Router(config)#", "expectedInput": "interface gigabitethernet0/0.10" },
        { "stepIndex": 3, "prompt": "Router(config-subif)#", "expectedInput": "encapsulation dot1q 10" },
        { "stepIndex": 4, "prompt": "Router(config-subif)#", "expectedInput": "ip address 192.168.10.1 255.255.255.0" }
      ]
    },
    {
      id: "prob_014",
      title: "Secure Telnet/VTY lines",
      topic: "Device Security",
      difficulty: "Medium",
      author: "NetCadet_99",
      format: "blanks",
      instructions: "Configure VTY virtual terminal lines 0 through 15 with local login security and password credentials 'cisco123'.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "line vty", "blankValue": "0 15", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "password", "blankValue": "cisco123", "textAfter": "" },
        { "lineIndex": 2, "textBefore": "login", "blankValue": "local", "textAfter": "" }
      ]
    },
    {
      id: "prob_015",
      title: "Dynamic NAT with Overload",
      topic: "IP Routing",
      difficulty: "Hard",
      author: "NetworkDean",
      format: "typing",
      instructions: "Configure dynamic NAT Overload (PAT). Permit source subnet 192.168.1.0/24 in access-list 1, and translate it to the outside public interface GigabitEthernet0/1 with overload.",
      steps: [
        { "stepIndex": 0, "prompt": "Router>", "expectedInput": "enable" },
        { "stepIndex": 1, "prompt": "Router#", "expectedInput": "configure terminal" },
        { "stepIndex": 2, "prompt": "Router(config)#", "expectedInput": "access-list 1 permit 192.168.1.0 0.0.0.255" },
        { "stepIndex": 3, "prompt": "Router(config)#", "expectedInput": "ip nat inside source list 1 interface gigabitethernet0/1 overload" }
      ]
    },
    {
      id: "prob_016",
      title: "Static NAT Port Forwarding",
      topic: "Device Security",
      difficulty: "Hard",
      author: "CiscoGuru_2026",
      format: "blanks",
      instructions: "Establish a static Network Address Translation rule mapping TCP port 80 of local host 192.168.1.100 to the public address IP 203.0.113.5 port 80. Then configure interface gigabitethernet0/0 as inside NAT interface.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "ip nat", "blankValue": "inside source static tcp 192.168.1.100 80 203.0.113.5 80", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "interface", "blankValue": "gigabitethernet0/0", "textAfter": "" },
        { "lineIndex": 2, "textBefore": "ip nat", "blankValue": "inside", "textAfter": "" }
      ]
    }
  ],
  leaderboard: [
    { "rank": 1, "username": "CiscoGuru_2026", "points": 12450, "accuracy": "98.5%" },
    { "rank": 2, "username": "PacketDropper", "points": 10900, "accuracy": "94.2%" },
    { "rank": 3, "username": "LoopbackZero", "points": 9300, "accuracy": "92.0%" },
    { "rank": 4, "username": "BgpNeighbor", "points": 8100, "accuracy": "91.5%" },
    { "rank": 5, "username": "SubnetSlayer", "points": 7500, "accuracy": "90.1%" },
    { "rank": 6, "username": "NetMaster", "points": 82, "accuracy": "95.0%" }
  ],
  users: [
    {
      username: "NetCadet_99",
      mockRole: "Student",
      totalPoints: 4250,
      globalRank: 14,
      fullName: "Charlie Cadet",
      bio: "Training hard to master Cisco IOS syntax and secure subnet routes.",
      targetCert: "CCNA",
      experienceLevel: "Beginner",
      terminalTheme: "Cyan",
      status: "Active"
    },
    {
      username: "NetInstructor_7",
      mockRole: "Tutor",
      totalPoints: 9500,
      globalRank: 3,
      fullName: "Prof. Sarah Jenkins",
      bio: "Senior Instructor. Specializing in advanced routing, OSPF configurations, and campus switching architecture.",
      targetCert: "CCNP",
      experienceLevel: "Intermediate",
      terminalTheme: "Amber",
      status: "Active"
    },
    {
      username: "NetAdmin_Chief",
      mockRole: "Admin",
      totalPoints: 15000,
      globalRank: 1,
      fullName: "Chief Alex Mercer",
      bio: "Root level network administrator. Complete access privileges for Core BGP configurations and sandboxes.",
      targetCert: "CCIE",
      experienceLevel: "Expert",
      terminalTheme: "Ruby",
      status: "Active"
    },
    {
      username: "CiscoGuru_2026",
      mockRole: "Tutor",
      totalPoints: 12450,
      globalRank: 2,
      fullName: "David Vance",
      bio: "CCIE #49281. Network Architecture Consultant. Passionate about teaching routing and switching concepts.",
      targetCert: "CCIE",
      experienceLevel: "Expert",
      terminalTheme: "Emerald",
      status: "Active"
    },
    {
      username: "PacketDropper",
      mockRole: "Student",
      totalPoints: 10900,
      globalRank: 4,
      fullName: "Elena Rostova",
      bio: "Routing protocols enthusiast. Trying to speedrun CCNA/CCNP exams.",
      targetCert: "CCNP",
      experienceLevel: "Intermediate",
      terminalTheme: "Cyan",
      status: "Active"
    },
    {
      username: "LoopbackZero",
      mockRole: "Student",
      totalPoints: 9300,
      globalRank: 5,
      fullName: "Marcus Aurelius",
      bio: "Connecting things together since 2024. Focused on secure gateway topologies.",
      targetCert: "CCNA",
      experienceLevel: "Beginner",
      terminalTheme: "Cyan",
      status: "Active"
    },
    {
      username: "BgpNeighbor",
      mockRole: "Student",
      totalPoints: 8100,
      globalRank: 7,
      fullName: "Kenji Sato",
      bio: "BGP & MPLS network designer. Operating autonomous system peerings.",
      targetCert: "CCIE",
      experienceLevel: "Expert",
      terminalTheme: "Ruby",
      status: "Suspended"
    },
    {
      username: "SubnetSlayer",
      mockRole: "Student",
      totalPoints: 7500,
      globalRank: 8,
      fullName: "Amira Patel",
      bio: "I slash subnets with precision. VLSM layout specialist.",
      targetCert: "CCNA",
      experienceLevel: "Intermediate",
      terminalTheme: "Emerald",
      status: "Active"
    }
  ]
};

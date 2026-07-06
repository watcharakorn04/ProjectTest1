import { AppState } from "./types";

export const initialAppState: AppState = {
  currentUserState: {
    username: "NetCadet_99",
    mockRole: "Student",
    totalPoints: 4250,
    globalRank: 14
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
      id: "prob_002",
      title: "SSH Security Hardening Quiz",
      topic: "Device Security",
      difficulty: "Medium",
      author: "NetCadet_99",
      format: "blanks",
      instructions: "Fill in the missing command syntax blocks to establish secure cryptographic keys and local access control lines.",
      blankLines: [
        { "lineIndex": 0, "textBefore": "ip domain-name", "blankValue": "forge.net", "textAfter": "" },
        { "lineIndex": 1, "textBefore": "crypto", "blankValue": "key", "textAfter": "generate rsa modulus 2048" },
        { "lineIndex": 2, "textBefore": "line vty 0 4", "blankValue": "transport input", "textAfter": "ssh" }
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
    }
  ],
  leaderboard: [
    { "rank": 1, "username": "CiscoGuru_2026", "points": 12450, "accuracy": "98.5%" },
    { "rank": 2, "username": "PacketDropper", "points": 10900, "accuracy": "94.2%" },
    { "rank": 3, "username": "LoopbackZero", "points": 9300, "accuracy": "92.0%" },
    { "rank": 4, "username": "BgpNeighbor", "points": 8100, "accuracy": "91.5%" },
    { "rank": 5, "username": "SubnetSlayer", "points": 7500, "accuracy": "90.1%" },
    { "rank": 14, "username": "NetCadet_99", "points": 4250, "accuracy": "89.1%" }
  ]
};

"use client";
import { motion } from "framer-motion";
type Member = { name: string; image: string };
export function HoverMember({ teamMembers, defaultName = "BENAQ" }: { teamMembers: Member[]; defaultName?: string }) {
  return <div className="skiper6-showcase" aria-label="Principios de Benaq">{teamMembers.map((member, index) => <motion.figure key={member.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }}><img src={member.image} alt=""/><figcaption>{member.name}</figcaption></motion.figure>)}<strong>{defaultName}</strong></div>;
}
export function Skiper6() { return <HoverMember defaultName="BENAQ" teamMembers={[]} />; }

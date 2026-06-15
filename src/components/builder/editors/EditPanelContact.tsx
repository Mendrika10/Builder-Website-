"use client";

import { SectionLabel } from "../ui/SectionLabel";
import { FieldText } from "../ui/FieldText";
import { FieldColor } from "../ui/FieldColor";

export function EditPanelContact({
  data,
  onUpdate,
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });
  return (
    <>
      <SectionLabel>Contenu</SectionLabel>
      <FieldText
        label="Label de section"
        value={data.sectionLabel as string}
        onChange={(v) => set("sectionLabel", v)}
      />
      <FieldText
        label="Titre"
        value={data.title as string}
        onChange={(v) => set("title", v)}
      />
      <FieldText
        label="Sous-titre"
        value={data.subtitle as string}
        onChange={(v) => set("subtitle", v)}
      />
      <SectionLabel>Informations de contact</SectionLabel>
      <FieldText
        label="Email"
        value={(data.email as string) || ""}
        onChange={(v) => set("email", v)}
      />
      <FieldText
        label="Téléphone"
        value={(data.phone as string) || ""}
        onChange={(v) => set("phone", v)}
      />
      <FieldText
        label="Adresse"
        value={(data.address as string) || ""}
        onChange={(v) => set("address", v)}
      />
      <SectionLabel>Labels du formulaire</SectionLabel>
      <FieldText
        label="Label champ Nom"
        value={(data.labelNom as string) || "Votre nom"}
        onChange={(v) => set("labelNom", v)}
      />
      <FieldText
        label="Label champ Email"
        value={(data.labelEmail as string) || "Votre email"}
        onChange={(v) => set("labelEmail", v)}
      />
      <FieldText
        label="Label champ Message"
        value={(data.labelMessage as string) || "Votre message"}
        onChange={(v) => set("labelMessage", v)}
      />
      <FieldText
        label="Texte du bouton"
        value={(data.labelSubmit as string) || "Envoyer le message"}
        onChange={(v) => set("labelSubmit", v)}
      />
      <SectionLabel>Couleur</SectionLabel>
      <FieldColor
        label="Couleur de fond"
        value={(data.bgColor as string) || "#F8FAFC"}
        onChange={(v) => set("bgColor", v)}
      />
    </>
  );
}

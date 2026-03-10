import type { FC } from "react";
import type { CreateClienteInput } from "../../api/clienti";
import ClienteFormModal, { type ClienteFormValues } from "./ClienteFormModal";

type CreateClienteModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  onClose: () => void;
  onSubmit: (payload: CreateClienteInput) => Promise<void>;
};

const toOptionalText = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const mapCreatePayload = (values: ClienteFormValues): CreateClienteInput => ({
  nome: values.nome.trim(),
  cognome: values.cognome.trim(),
  email: values.email.trim(),
  telefono: toOptionalText(values.telefono),
  indirizzo: toOptionalText(values.indirizzo),
  citta: toOptionalText(values.citta),
  lavoro: toOptionalText(values.lavoro),
  terapie: toOptionalText(values.terapie),
  condizioniMediche: toOptionalText(values.condizioniMediche),
  note: toOptionalText(values.note),
  dataNascita: values.dataNascita,
  sesso: values.sesso,
  altezza: values.altezza,
  peso: values.peso,
  massaMagra: values.massaMagra,
  massaGrassa: values.massaGrassa,
});

const CreateClienteModal: FC<CreateClienteModalProps> = ({
  isOpen,
  isSubmitting,
  submitError,
  onClose,
  onSubmit,
}) => {
  return (
    <ClienteFormModal
      mode="create"
      isOpen={isOpen}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onClose={onClose}
      onSubmit={async (values) => {
        await onSubmit(mapCreatePayload(values));
      }}
      title="Nuovo cliente"
      submitLabel="Crea cliente"
    />
  );
};

export default CreateClienteModal;

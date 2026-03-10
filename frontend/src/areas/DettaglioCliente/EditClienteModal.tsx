import type { FC } from "react";
import type { ClienteDettaglio, UpdateClienteInput } from "../../api/clienti";
import ClienteFormModal, {
  type ClienteFormValues,
} from "../Clienti/ClienteFormModal";

type EditClienteModalProps = {
  isOpen: boolean;
  isSubmitting: boolean;
  submitError: string | null;
  cliente: ClienteDettaglio;
  onClose: () => void;
  onSubmit: (payload: UpdateClienteInput) => Promise<void>;
};

const toOptionalText = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

const mapInitialValues = (
  cliente: ClienteDettaglio,
): Partial<ClienteFormValues> => ({
  email: cliente.email,
  telefono: cliente.telefono ?? "",
  indirizzo: cliente.indirizzo ?? "",
  citta: cliente.citta ?? "",
  sesso: cliente.sesso,
  altezza: Number(cliente.altezza),
  peso: Number(cliente.peso),
  massaMagra: cliente.massaMagra == null ? 0 : Number(cliente.massaMagra),
  massaGrassa: cliente.massaGrassa == null ? 0 : Number(cliente.massaGrassa),
  terapie: cliente.terapie ?? "",
  condizioniMediche: cliente.condizioniMediche ?? "",
  note: cliente.note ?? "",
  lavoro: cliente.lavoro ?? "",
});

const mapUpdatePayload = (values: ClienteFormValues): UpdateClienteInput => ({
  telefono: toOptionalText(values.telefono),
  email: values.email.trim(),
  indirizzo: toOptionalText(values.indirizzo),
  citta: toOptionalText(values.citta),
  sesso: values.sesso,
  altezza: values.altezza,
  peso: values.peso,
  massaMagra: values.massaMagra,
  massaGrassa: values.massaGrassa,
  terapie: toOptionalText(values.terapie),
  condizioniMediche: toOptionalText(values.condizioniMediche),
  note: toOptionalText(values.note),
  lavoro: toOptionalText(values.lavoro),
});

const EditClienteModal: FC<EditClienteModalProps> = ({
  isOpen,
  isSubmitting,
  submitError,
  cliente,
  onClose,
  onSubmit,
}) => {
  return (
    <ClienteFormModal
      mode="edit"
      isOpen={isOpen}
      isSubmitting={isSubmitting}
      submitError={submitError}
      onClose={onClose}
      onSubmit={async (values) => {
        await onSubmit(mapUpdatePayload(values));
      }}
      initialValues={mapInitialValues(cliente)}
      title="Modifica dati cliente"
      submitLabel="Salva modifiche"
    />
  );
};

export default EditClienteModal;

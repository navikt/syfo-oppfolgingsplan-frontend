import type { ReactEventHandler, ReactNode, SyntheticEvent } from "react";
import { vi } from "vitest";

interface ModalHeaderProps {
  heading?: string;
}

interface ModalProps {
  children: ReactNode;
  header?: ModalHeaderProps;
  onClose?: ReactEventHandler<HTMLDialogElement>;
  onBeforeClose?: () => boolean;
}

interface ModalSectionProps {
  children: ReactNode;
}

export async function mockAkselModal() {
  const actual =
    await vi.importActual<typeof import("@navikt/ds-react")>("@navikt/ds-react");

  const Modal = Object.assign(
    ({ children, header, onClose, onBeforeClose }: ModalProps) => (
      <div>
        {header?.heading ? <h2>{header.heading}</h2> : null}
        <button
          type="button"
          aria-label="Lukk modal"
          onClick={() => {
            if (onBeforeClose?.() === false) {
              return;
            }

            onClose?.({} as SyntheticEvent<HTMLDialogElement>);
          }}
        >
          Lukk
        </button>
        {children}
      </div>
    ),
    {
      Body: ({ children }: ModalSectionProps) => <div>{children}</div>,
      Footer: ({ children }: ModalSectionProps) => <div>{children}</div>,
    },
  );

  return {
    ...actual,
    Modal,
  };
}

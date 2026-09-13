import { MediaFolder, MediaRef } from '../../shared/models';

/**
 * Datei-Uploads. Das Backend legt die Datei ab und liefert einen `MediaRef`,
 * der dann in den Inhalten gespeichert wird.
 */
export abstract class MediaApi {
  abstract upload(file: File, folder: MediaFolder): Promise<MediaRef>;
  abstract remove(ref: MediaRef): Promise<void>;
}

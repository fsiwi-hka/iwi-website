import { Component, computed, inject, input, model, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { errorMessage } from '../../../core/api/api-error';
import { MediaApi } from '../../../core/api/media-api';
import { isImage, isVideo, MediaFolder, MediaRef } from '../../models';
import { formatBytes } from '../../utils/file';
import { createId } from '../../utils/id';
import { ToastService } from '../toast/toast.service';

export type MediaPreviewMode = 'cover' | 'contain' | 'avatar';

/**
 * Datei auswaehlen, ueber die MediaApi hochladen und den `MediaRef` als Wert
 * liefern. Zwei-Wege-Bindung ueber `[(value)]`; mit Signal Forms:
 * `[value]="form.image().value()" (valueChange)="form.image().value.set($event)"`.
 */
@Component({
  selector: 'app-media-picker',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './media-picker.html',
  styleUrl: './media-picker.scss',
})
export class MediaPicker {
  private readonly media = inject(MediaApi);
  private readonly toast = inject(ToastService);

  readonly value = model<MediaRef | null>(null);
  readonly folder = input.required<MediaFolder>();
  readonly accept = input('image/*');
  readonly label = input('Datei');
  readonly hint = input('');
  readonly previewMode = input<MediaPreviewMode>('cover');
  readonly disabled = input(false);

  protected readonly inputId = `media-picker-${createId()}`;
  protected readonly uploading = signal(false);
  protected readonly showImage = computed(() => isImage(this.value()));
  protected readonly showVideo = computed(() => isVideo(this.value()));
  protected readonly sizeLabel = computed(() => formatBytes(this.value()?.size ?? 0));
  protected readonly busy = computed(() => this.disabled() || this.uploading());

  protected async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Zuruecksetzen, damit dieselbe Datei erneut gewaehlt werden kann.
    input.value = '';
    if (!file) {
      return;
    }
    this.uploading.set(true);
    try {
      const ref = await this.media.upload(file, this.folder());
      this.value.set(ref);
    } catch (error) {
      this.toast.error(errorMessage(error));
    } finally {
      this.uploading.set(false);
    }
  }

  protected clear(): void {
    this.value.set(null);
  }
}

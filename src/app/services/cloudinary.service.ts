import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CloudinaryService {
  private readonly signatureUrl = `${environment.apiBaseUrl}/Auth/signature`;

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    // Get signature from backend
    return this.http.post<any>(this.signatureUrl, {}).pipe(
      switchMap((sig) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('api_key', sig.apiKey);
        formData.append('timestamp', sig.timestamp);
        formData.append('signature', sig.signature);
        formData.append('folder', 'medvault/documents');
        formData.append('UseFilename', 'true');
        formData.append('UniqueFilename', 'true');
        formData.append('Overwrite', 'false');

        // Upload directly to Cloudinary
        return this.http.post(
          `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
          formData
        );
      })
    );
  }
}

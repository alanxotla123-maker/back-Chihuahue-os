import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { extname } from 'path';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET || '';
    
    // Configura el cliente S3. Si no hay claves, S3Client intentará usar roles locales (pero probablemente falle si no están en .env)
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!this.bucketName) {
      throw new InternalServerErrorException('El nombre del bucket S3 no está configurado en las variables de entorno.');
    }

    // Generar un nombre único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    const filename = `imagenes/${uniqueSuffix}${ext}`;

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'public-read' // Opcional: Descomentar si el bucket no tiene una política pública predeterminada y permite ACLs.
      });

      await this.s3Client.send(command);

      // Retornar la URL pública de la imagen
      return `https://${this.bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${filename}`;
    } catch (error) {
      console.error('Error subiendo imagen a S3:', error);
      throw new InternalServerErrorException('Error al subir la imagen al bucket S3.');
    }
  }
}

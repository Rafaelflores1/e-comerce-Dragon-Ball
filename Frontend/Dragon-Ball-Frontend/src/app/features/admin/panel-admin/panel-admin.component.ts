import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductosService } from '../../../shared/services/productos.service';
import { IProducto } from '../../../shared/interfaces/iproducto';
import { CommonModule, NgClass } from '@angular/common';



@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [ReactiveFormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent implements OnInit {
  public productosService = inject(ProductosService);
  private fb = inject(FormBuilder);

  editingProductId = signal<number | null>(null);
  
  // Variables para la subida de imágenes
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  productForm = this.fb.group({
    nombre: ['', Validators.required],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    descripcion: [''],
    categoria_id: [null as number | null],
    saga_id: [null as number | null]
    // Eliminamos 'imagen' del formGroup reactivo
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.productosService.getProductosAdmin(),
      this.productosService.getProductos(),
      this.productosService.getCategorias(),
      this.productosService.getSagas()
    ]);
  }

  // Método para capturar el archivo seleccionado
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Crear vista previa de la imagen
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  async saveProduct(): Promise<void> {
    if (this.productForm.invalid) return;

    // Crear un FormData para poder enviar el archivo
    const formData = new FormData();
    const formValues = this.productForm.value;

    formData.append('nombre', formValues.nombre!);
    formData.append('precio', formValues.precio!.toString());
    formData.append('stock', formValues.stock!.toString());
    formData.append('descripcion', formValues.descripcion || '');
    if (formValues.categoria_id) formData.append('categoria_id', formValues.categoria_id.toString());
    if (formValues.saga_id) formData.append('saga_id', formValues.saga_id.toString());

    // Añadir la imagen solo si se ha seleccionado una nueva
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile); // 'imagen' debe coincidir con el nombre de campo en multer del backend
    }

    const currentId = this.editingProductId();

    try {
      if (currentId) {
        await this.productosService.updateProducto(currentId, formData);
      } else {
        await this.productosService.createProducto(formData);
      }

      this.resetForm();
      await this.productosService.getProductosAdmin();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }

  editProduct(product: IProducto): void {
    this.editingProductId.set(product.id);
    
    this.productForm.patchValue({
      nombre: product.nombre,
      precio: product.precio,
      descripcion: product.descripcion,
      categoria_id: product.categoria_id,
      saga_id: product.saga_id
    });

    // Mostrar la imagen actual del backend en la vista previa
    this.imagePreview.set(product.imagen_url || null);
    this.selectedFile = null;
  }

  async deleteProduct(id: number): Promise<void> {
    if (confirm('¿Seguro que deseas eliminar este producto?')) {
      try {
        await this.productosService.deleteProducto(id);
        await this.productosService.getProductos();
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    }
  }

  resetForm(): void {
    this.editingProductId.set(null);
    this.productForm.reset();
    
    // Limpiar campos de imagen
    this.selectedFile = null;
    this.imagePreview.set(null);
    
    // Limpiar el input de archivo físico en el HTML
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}
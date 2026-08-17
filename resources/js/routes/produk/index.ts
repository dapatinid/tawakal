import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/produk',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::index
* @see app/Http/Controllers/ProdukController.php:21
* @route '/produk'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
export const show = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}/show',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
show.url = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { produk: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: typeof args.produk === 'object'
        ? args.produk.slug
        : args.produk,
    }

    return show.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
show.get = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
show.head = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
const showForm = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
showForm.get = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::show
* @see app/Http/Controllers/ProdukController.php:118
* @route '/produk/{produk}/show'
*/
showForm.head = (args: { produk: string | number | { slug: string | number } } | [produk: string | number | { slug: string | number } ] | string | number | { slug: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
export const preview = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
preview.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return preview.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
preview.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
preview.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
const previewForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
previewForm.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::preview
* @see app/Http/Controllers/ProdukController.php:160
* @route '/produk/{produk}/preview'
*/
previewForm.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

preview.form = previewForm

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/produk/buat/baru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::create
* @see app/Http/Controllers/ProdukController.php:192
* @route '/produk/buat/baru'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/produk/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::store
* @see app/Http/Controllers/ProdukController.php:451
* @route '/produk/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
export const edit = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/produk/{produk}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
edit.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return edit.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
edit.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
edit.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
const editForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
editForm.get = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::edit
* @see app/Http/Controllers/ProdukController.php:200
* @route '/produk/{produk}/edit'
*/
editForm.head = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
export const update = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/produk/{produk}/update',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
update.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return update.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
update.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
const updateForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::update
* @see app/Http/Controllers/ProdukController.php:212
* @route '/produk/{produk}/update'
*/
updateForm.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
export const toggleActive = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleActive.url(args, options),
    method: 'put',
})

toggleActive.definition = {
    methods: ["put"],
    url: '/produk/{produk}/toggle-active',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
toggleActive.url = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { produk: args }
    }

    if (Array.isArray(args)) {
        args = {
            produk: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        produk: args.produk,
    }

    return toggleActive.definition.url
            .replace('{produk}', parsedArgs.produk.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
toggleActive.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: toggleActive.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
const toggleActiveForm = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleActive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::toggleActive
* @see app/Http/Controllers/ProdukController.php:554
* @route '/produk/{produk}/toggle-active'
*/
toggleActiveForm.put = (args: { produk: string | number } | [produk: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleActive.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

toggleActive.form = toggleActiveForm

/**
* @see \App\Http\Controllers\ProdukController::bulkQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
export const bulkQueue = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkQueue.url(options),
    method: 'post',
})

bulkQueue.definition = {
    methods: ["post"],
    url: '/produk/bulk-queue',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
bulkQueue.url = (options?: RouteQueryOptions) => {
    return bulkQueue.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
bulkQueue.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkQueue.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
const bulkQueueForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkQueue.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkQueue
* @see app/Http/Controllers/ProdukController.php:603
* @route '/produk/bulk-queue'
*/
bulkQueueForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkQueue.url(options),
    method: 'post',
})

bulkQueue.form = bulkQueueForm

/**
* @see \App\Http\Controllers\ProdukController::bulkRemove
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
export const bulkRemove = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemove.url(args, options),
    method: 'post',
})

bulkRemove.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove/{product}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkRemove
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
bulkRemove.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return bulkRemove.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkRemove
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
bulkRemove.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemove.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemove
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
const bulkRemoveForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemove.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemove
* @see app/Http/Controllers/ProdukController.php:615
* @route '/produk/bulk-remove/{product}'
*/
bulkRemoveForm.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemove.url(args, options),
    method: 'post',
})

bulkRemove.form = bulkRemoveForm

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
export const bulkRemoveAll = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemoveAll.url(options),
    method: 'post',
})

bulkRemoveAll.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove-all',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
bulkRemoveAll.url = (options?: RouteQueryOptions) => {
    return bulkRemoveAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
bulkRemoveAll.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemoveAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
const bulkRemoveAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemoveAll.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAll
* @see app/Http/Controllers/ProdukController.php:621
* @route '/produk/bulk-remove-all'
*/
bulkRemoveAllForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemoveAll.url(options),
    method: 'post',
})

bulkRemoveAll.form = bulkRemoveAllForm

/**
* @see \App\Http\Controllers\ProdukController::bulkPrice
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
export const bulkPrice = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPrice.url(options),
    method: 'get',
})

bulkPrice.definition = {
    methods: ["get","head"],
    url: '/produk/bulk-price',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkPrice
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPrice.url = (options?: RouteQueryOptions) => {
    return bulkPrice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkPrice
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPrice.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPrice.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPrice
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPrice.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkPrice.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPrice
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
const bulkPriceForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPrice.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPrice
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPriceForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPrice.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPrice
* @see app/Http/Controllers/ProdukController.php:627
* @route '/produk/bulk-price'
*/
bulkPriceForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPrice.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bulkPrice.form = bulkPriceForm

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
export const bulkProcessPrice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkProcessPrice.url(options),
    method: 'post',
})

bulkProcessPrice.definition = {
    methods: ["post"],
    url: '/produk/bulk-process-price',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
bulkProcessPrice.url = (options?: RouteQueryOptions) => {
    return bulkProcessPrice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
bulkProcessPrice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkProcessPrice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
const bulkProcessPriceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkProcessPrice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPrice
* @see app/Http/Controllers/ProdukController.php:677
* @route '/produk/bulk-process-price'
*/
bulkProcessPriceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkProcessPrice.url(options),
    method: 'post',
})

bulkProcessPrice.form = bulkProcessPriceForm

/**
* @see \App\Http\Controllers\ProdukController::bulkQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
export const bulkQueueAlumunium = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkQueueAlumunium.url(options),
    method: 'post',
})

bulkQueueAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-queue-alumunium',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
bulkQueueAlumunium.url = (options?: RouteQueryOptions) => {
    return bulkQueueAlumunium.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
bulkQueueAlumunium.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkQueueAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
const bulkQueueAlumuniumForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkQueueAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkQueueAlumunium
* @see app/Http/Controllers/ProdukController.php:871
* @route '/produk/bulk-queue-alumunium'
*/
bulkQueueAlumuniumForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkQueueAlumunium.url(options),
    method: 'post',
})

bulkQueueAlumunium.form = bulkQueueAlumuniumForm

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
export const bulkRemoveAlumunium = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemoveAlumunium.url(args, options),
    method: 'post',
})

bulkRemoveAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove-alumunium/{product}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
bulkRemoveAlumunium.url = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return bulkRemoveAlumunium.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
bulkRemoveAlumunium.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemoveAlumunium.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
const bulkRemoveAlumuniumForm = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemoveAlumunium.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAlumunium
* @see app/Http/Controllers/ProdukController.php:881
* @route '/produk/bulk-remove-alumunium/{product}'
*/
bulkRemoveAlumuniumForm.post = (args: { product: string | number | { id: string | number } } | [product: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemoveAlumunium.url(args, options),
    method: 'post',
})

bulkRemoveAlumunium.form = bulkRemoveAlumuniumForm

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
export const bulkRemoveAllAlumunium = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemoveAllAlumunium.url(options),
    method: 'post',
})

bulkRemoveAllAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-remove-all-alumunium',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
bulkRemoveAllAlumunium.url = (options?: RouteQueryOptions) => {
    return bulkRemoveAllAlumunium.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
bulkRemoveAllAlumunium.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkRemoveAllAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
const bulkRemoveAllAlumuniumForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemoveAllAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkRemoveAllAlumunium
* @see app/Http/Controllers/ProdukController.php:887
* @route '/produk/bulk-remove-all-alumunium'
*/
bulkRemoveAllAlumuniumForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkRemoveAllAlumunium.url(options),
    method: 'post',
})

bulkRemoveAllAlumunium.form = bulkRemoveAllAlumuniumForm

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
export const bulkPriceAlumunium = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceAlumunium.url(options),
    method: 'get',
})

bulkPriceAlumunium.definition = {
    methods: ["get","head"],
    url: '/produk/bulk-price-alumunium',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumunium.url = (options?: RouteQueryOptions) => {
    return bulkPriceAlumunium.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumunium.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bulkPriceAlumunium.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumunium.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bulkPriceAlumunium.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
const bulkPriceAlumuniumForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceAlumunium.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumuniumForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceAlumunium.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:841
* @route '/produk/bulk-price-alumunium'
*/
bulkPriceAlumuniumForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: bulkPriceAlumunium.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

bulkPriceAlumunium.form = bulkPriceAlumuniumForm

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
export const bulkProcessPriceAlumunium = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkProcessPriceAlumunium.url(options),
    method: 'post',
})

bulkProcessPriceAlumunium.definition = {
    methods: ["post"],
    url: '/produk/bulk-process-price-alumunium',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
bulkProcessPriceAlumunium.url = (options?: RouteQueryOptions) => {
    return bulkProcessPriceAlumunium.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
bulkProcessPriceAlumunium.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkProcessPriceAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
const bulkProcessPriceAlumuniumForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkProcessPriceAlumunium.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProdukController::bulkProcessPriceAlumunium
* @see app/Http/Controllers/ProdukController.php:894
* @route '/produk/bulk-process-price-alumunium'
*/
bulkProcessPriceAlumuniumForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: bulkProcessPriceAlumunium.url(options),
    method: 'post',
})

bulkProcessPriceAlumunium.form = bulkProcessPriceAlumuniumForm

const produk = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    preview: Object.assign(preview, preview),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    edit: Object.assign(edit, edit),
    update: Object.assign(update, update),
    toggleActive: Object.assign(toggleActive, toggleActive),
    bulkQueue: Object.assign(bulkQueue, bulkQueue),
    bulkRemove: Object.assign(bulkRemove, bulkRemove),
    bulkRemoveAll: Object.assign(bulkRemoveAll, bulkRemoveAll),
    bulkPrice: Object.assign(bulkPrice, bulkPrice),
    bulkProcessPrice: Object.assign(bulkProcessPrice, bulkProcessPrice),
    bulkQueueAlumunium: Object.assign(bulkQueueAlumunium, bulkQueueAlumunium),
    bulkRemoveAlumunium: Object.assign(bulkRemoveAlumunium, bulkRemoveAlumunium),
    bulkRemoveAllAlumunium: Object.assign(bulkRemoveAllAlumunium, bulkRemoveAllAlumunium),
    bulkPriceAlumunium: Object.assign(bulkPriceAlumunium, bulkPriceAlumunium),
    bulkProcessPriceAlumunium: Object.assign(bulkProcessPriceAlumunium, bulkProcessPriceAlumunium),
}

export default produk